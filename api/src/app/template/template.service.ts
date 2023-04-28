import { Injectable } from '@nestjs/common';
import { Template } from './template.entity';
import { TemplateRepository } from './template.repository';
import { User } from '../shared/user/user.entity';
import { OntologyFile } from '../ontology/ontologyFile/ontologyFile.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateVersionRepository } from './templateVersion/templateVersion.repository';
import { TemplateFileService } from './templateFile/templateFile.service';
import { TemplateNode } from './templateNode/templateNode.entity';
import { EditTemplateDto } from './dto/edit-template.dto';
import { BpmnElementData } from '../bpmn/bpmnElement.data';
import { OntologyNode } from '../ontology/ontologyNode/ontologyNode.entity';
import { OntologyNodeRepository } from '../ontology/ontologyNode/ontologyNode.repository';
import { DatabaseRelationAnalyzeData } from '../ontology/ontologyNode/databaseRelationAnalyze.data';
import { TemplateAnalyzeData } from '../ontology/ontologyNode/templateAnalyze.data';
import { Workspace } from '../workspace/workspace.entity';

@Injectable()
export class TemplateService {
    public constructor(
        private readonly templateRepository: TemplateRepository,
        private readonly templateVersionRepository: TemplateVersionRepository,
        private readonly templateFileService: TemplateFileService,
        private readonly ontologyNodeRepository: OntologyNodeRepository,
    ) {}

    public async getTemplatesSorted(): Promise<Template[]> {
        return (await this.templateRepository.find({ deleted: false })).sort(
            (a: Template, b: Template): number => {
                const aName = a.getName();
                const bName = b.getName();
                return aName > bName ? 1 : bName > aName ? -1 : 0;
            },
        );
    }

    public async getOneByUuid(templateUuid: string): Promise<Template> {
        return this.templateRepository.findOneOrFail({
            uuid: templateUuid,
            deleted: false,
        });
    }

    public async create(
        user: User,
        ontologyFile: OntologyFile,
        file: Buffer,
        createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const template = await Template.create(
            this.templateFileService,
            user,
            ontologyFile,
            file,
            createTemplateDto,
        );

        await this.templateRepository.persistAndFlush(template);
        return template;
    }

    public async createWithBlankFile(
        user: User,
        ontologyFile: OntologyFile,
        createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const file = this.templateFileService.getBlankTemplateFileBuffer();

        return this.create(user, ontologyFile, file, createTemplateDto);
    }

    public async edit(
        template: Template,
        editTemplateDto: EditTemplateDto,
    ): Promise<Template> {
        template.edit(editTemplateDto);

        await this.templateRepository.flush();
        return template;
    }

    public async delete(template: Template): Promise<void> {
        template.delete();

        await this.templateRepository.flush();
    }

    public async publishNewTemplateVersion(template: Template): Promise<void> {
        const newDraftVersion = await template.publishDraftVersion(
            this.templateFileService,
        );

        await this.templateRepository.persistAndFlush(newDraftVersion);

        const publishedVersion = await template.getVersionPublished();
        for (const templateNode of await publishedVersion.getNodes()) {
            const newTemplateNode = TemplateNode.create(
                newDraftVersion,
                templateNode.getOntologyNode(),
                templateNode.getElementId(),
            );

            this.templateRepository.persist(newTemplateNode);
        }

        await this.templateRepository.flush();
    }

    public async analyzeTemplateByUPMM(
        templateNodes: BpmnElementData[],
        ontologyNodes: OntologyNode[],
    ): Promise<TemplateAnalyzeData[]> {
        const relationsFromDatabase: DatabaseRelationAnalyzeData[] = [];
        const namesOfNodesInTemplate: string[] = [];

        //array of names from bpmntemplate
        for (const ontologyNode of ontologyNodes) {
            namesOfNodesInTemplate.push(ontologyNode.getUuid());
        }
        // parsing data relations from database
        for (const ontologyNode of ontologyNodes) {
            const sourcesRefRelations = await ontologyNode.getSourceRef();
            const outgoing: string[] = [];

            for (const sourceRelation of sourcesRefRelations) {
                const ontologyNodeTarget =
                    await this.ontologyNodeRepository.findOneOrFail(
                        sourceRelation.getTargetRef().getUuid(),
                    );

                outgoing.push(ontologyNodeTarget.getUuid());
            }

            const ontologyAnalyzeData: DatabaseRelationAnalyzeData =
                new DatabaseRelationAnalyzeData(
                    ontologyNode.getUuid(),
                    outgoing,
                );
            relationsFromDatabase.push(ontologyAnalyzeData);
        }

        // checking not possible connection
        const templateAnalyzeDatas: TemplateAnalyzeData[] = [];
        for (const templateNode of templateNodes) {
            const databaseRelationObject = relationsFromDatabase.find(
                (databaseRelation) =>
                    databaseRelation.getUpmmUuid() ===
                    templateNode.getUpmmUuid(),
            );

            const templateOutgoing = templateNode.getOutgoing().sort();
            const databaseOutgoing = databaseRelationObject
                .getOutgoing()
                .sort();
            const result = templateOutgoing.every((value) =>
                databaseOutgoing.includes(value),
            );

            if (!result) {
                const differences = templateOutgoing.filter(
                    (value) => !databaseOutgoing.includes(value),
                );

                if (differences.length !== 0) {
                    const templateAnalyzeData: TemplateAnalyzeData =
                        new TemplateAnalyzeData(
                            databaseRelationObject.getUpmmUuid(),
                            differences,
                            [],
                            templateNode.getId(),
                        );
                    templateAnalyzeDatas.push(templateAnalyzeData);
                }
            }
        }

        //filter relations outgoing to only relations which nodes exists in diagram
        for (const relationFromDatabase of relationsFromDatabase) {
            const outgoing = relationFromDatabase.getOutgoing();
            const newOutgoing = outgoing.filter((value) =>
                namesOfNodesInTemplate.includes(value),
            );
            relationFromDatabase.setOutgoing(newOutgoing);
        }

        // remove empty objects
        const filteredTemplateAnalyzeDatas = templateAnalyzeDatas.filter(
            (templateError) =>
                templateError.getOverExtends().length !== 0 ||
                templateError.getNotPossible().length !== 0,
        );

        // transforming UUIDs to names
        for (const analyzedObject of filteredTemplateAnalyzeDatas) {
            const nameOfUuidsMissing: string[] = [];
            const nameOfUuidsOverExtends: string[] = [];
            for (const badRelation of analyzedObject.getNotPossible()) {
                const nodeObject =
                    await this.ontologyNodeRepository.findOneOrFail(
                        badRelation,
                    );
                const nameOfElement = nodeObject.getName();
                nameOfUuidsMissing.push(nameOfElement);
            }

            for (const badRelation of analyzedObject.getOverExtends()) {
                const nodeObject =
                    await this.ontologyNodeRepository.findOneOrFail(
                        badRelation,
                    );
                const nameOfElement = nodeObject.getName();
                nameOfUuidsOverExtends.push(nameOfElement);
            }
            const nodeObjectUpmm =
                await this.ontologyNodeRepository.findOneOrFail(
                    analyzedObject.getUpmmUuid(),
                );

            analyzedObject.setOverExtends(nameOfUuidsOverExtends);
            analyzedObject.setNotPossible(nameOfUuidsMissing);
            analyzedObject.setUpmmUuid(nodeObjectUpmm.getName());
        }

        return filteredTemplateAnalyzeDatas;
    }

    private createMapWithOccurences(values: string[]): Map<string, number> {
        const map = new Map<string, number>();

        values.forEach((str: string) => {
            if (map.has(str)) {
                const count = map.get(str) as number;
                map.set(str, count + 1);
            } else {
                map.set(str, 1);
            }
        });
        return map;
    }
}

import type { Dictionary } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Template } from '../app/template/template.entity';
import { CreateTemplateDto } from '../app/template/dto/create-template.dto';
import { TemplateFileService } from '../app/template/templateFile/templateFile.service';
import { FileService } from '../app/common/file/file.service';
import * as path from 'path';
import { FileData } from '../app/common/file/file.data';
import { BpmnService } from '../app/bpmn/bpmn.service';
import { TemplateNodeService } from '../app/template/templateNode/templateNode.service';
import { TemplateNodeRepository } from '../app/template/templateNode/templateNode.repository';
import { OntologyNodeRepository } from '../app/ontology/ontologyNode/ontologyNode.repository';
import { TemplateNode } from '../app/template/templateNode/templateNode.entity';
import { OntologyNode } from '../app/ontology/ontologyNode/ontologyNode.entity';
import { SqlEntityManager } from '@mikro-orm/mariadb';
import { OntologyFile } from '../app/ontology/ontologyFile/ontologyFile.entity';
import { User } from '../app/shared/user/user.entity';

export class TemplateSeeder extends Seeder {
    private static SEEDER_RESOURCES_FOLDER = path.join(
        process.cwd(),
        'src',
        'seeders',
        'resources',
    );

    private static WATERFALL_TEMPLATE_BPMN_FILE = path.join(
        TemplateSeeder.SEEDER_RESOURCES_FOLDER,
        'WaterfallTemplate.bpmn',
    );

    private static REQUIREMENT_PRIORITIZATION_TEMPLATE_BPMN_FILE = path.join(
        TemplateSeeder.SEEDER_RESOURCES_FOLDER,
        'RequirementPrioritizationTemplate.bpmn',
    );

    private static DEVELOPMENT_PROCESS_TEMPLATE_BPMN_FILE = path.join(
        TemplateSeeder.SEEDER_RESOURCES_FOLDER,
        'DevelopmentProcessTemplate.bpmn',
    );
    private static DEVELOPMENT_PROCESS_BAD_TEMPLATE_BPMN_FILE = path.join(
        TemplateSeeder.SEEDER_RESOURCES_FOLDER,
        'DevelopmentProcessBadTemplate.bpmn',
    );

    private bpmnService: BpmnService = new BpmnService();
    private fileService: FileService = new FileService();
    private templateFileService: TemplateFileService = new TemplateFileService(
        this.fileService,
    );

    private templateNodeService: TemplateNodeService;

    async run(
        entityManager: SqlEntityManager,
        context: Dictionary,
    ): Promise<void> {
        this.templateNodeService = new TemplateNodeService(
            new TemplateNodeRepository(entityManager, TemplateNode),
            new OntologyNodeRepository(entityManager, OntologyNode),
        );

        const adminUser = context.user.admin;
        const upmmOntology = context.ontology.upmm;

        const waterFallTemplate = await this.createTemplateWithAllRelations(
            entityManager,
            TemplateSeeder.WATERFALL_TEMPLATE_BPMN_FILE,
            adminUser,
            upmmOntology,
            new CreateTemplateDto('Waterfall'),
        );

        const requirementPrioritizationTemplate =
            await this.createTemplateWithAllRelations(
                entityManager,
                TemplateSeeder.REQUIREMENT_PRIORITIZATION_TEMPLATE_BPMN_FILE,
                adminUser,
                upmmOntology,
                new CreateTemplateDto('Requirement prioritization'),
            );

        const developmentProcessTemplate =
            await this.createTemplateWithAllRelations(
                entityManager,
                TemplateSeeder.DEVELOPMENT_PROCESS_TEMPLATE_BPMN_FILE,
                adminUser,
                upmmOntology,
                new CreateTemplateDto('Development process'),
            );

        const developmentProcessBadTemplate =
            await this.createTemplateWithAllRelations(
                entityManager,
                TemplateSeeder.DEVELOPMENT_PROCESS_BAD_TEMPLATE_BPMN_FILE,
                adminUser,
                upmmOntology,
                new CreateTemplateDto('Development process bad template '),
            );

        context.template = {
            waterfall: waterFallTemplate,
            requirementPrioritization: requirementPrioritizationTemplate,
            developmentProcessTemplate: developmentProcessTemplate,
            developmentProcessBadTemplate: developmentProcessBadTemplate,
        };
    }

    private async createTemplateWithAllRelations(
        entityManager: SqlEntityManager,
        templateFileName: string,
        templateUser: User,
        ontologyFile: OntologyFile,
        createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const waterfallTemplateFile =
            await this.bpmnService.changeStructureOfImportedFile(
                this.fileService.readFile(
                    FileData.createFromFilePathWithName(templateFileName),
                ),
                await ontologyFile.getNodes(),
                [],
                true,
            );

        const template = await Template.create(
            this.templateFileService,
            templateUser,
            ontologyFile,
            waterfallTemplateFile,
            createTemplateDto,
        );

        await entityManager.persistAndFlush(template);

        const allBpmnElements = (
            await this.bpmnService.parseBpmnFile(
                await template.getPublishedFileName(),
                false,
                false,
            )
        ).flatMap((obj) => obj.getElements());

        await this.templateNodeService.createFromBpmnData(
            allBpmnElements,
            await template.getVersionPublished(),
        );

        await this.templateNodeService.createFromBpmnData(
            allBpmnElements,
            await template.getVersionDraft(),
        );

        return template;
    }
}

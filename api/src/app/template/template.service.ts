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

@Injectable()
export class TemplateService {
    public constructor(
        private readonly templateRepository: TemplateRepository,
        private readonly templateVersionRepository: TemplateVersionRepository,
        private readonly templateFileService: TemplateFileService,
    ) {}

    public async getTemplates(): Promise<Template[]> {
        return this.templateRepository.findAll();
    }

    public async getOneByUuid(templateUuid: string): Promise<Template> {
        return this.templateRepository.findOneOrFail({ uuid: templateUuid });
    }

    public async create(
        user: User,
        ontologyFile: OntologyFile,
        createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const template = await Template.create(
            this.templateFileService,
            user,
            ontologyFile,
            createTemplateDto,
        );

        await this.templateRepository.persistAndFlush(template);
        return template;
    }

    public async edit(
        template: Template,
        editTemplateDto: EditTemplateDto,
    ): Promise<Template> {
        template.edit(editTemplateDto);

        await this.templateRepository.flush();
        return template;
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
}

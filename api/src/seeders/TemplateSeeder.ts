import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Template } from '../app/template/template.entity';
import { CreateTemplateDto } from '../app/template/dto/create-template.dto';
import { TemplateFileService } from '../app/template/templateFile/templateFile.service';
import { FileService } from '../app/common/file/file.service';

export class TemplateSeeder extends Seeder {
    async run(
        entityManager: EntityManager,
        context: Dictionary,
    ): Promise<void> {
        const fileService = new FileService();
        const templateFileService = new TemplateFileService(fileService);

        const adminUser = context.user.admin;
        const upmmOntology = context.ontology.upmm;

        const scrumTemplate = await Template.create(
            templateFileService,
            adminUser,
            upmmOntology,
            new CreateTemplateDto('SCRUM'),
        );

        await entityManager.persistAndFlush(scrumTemplate);

        context.template = {
            scrum: scrumTemplate,
        };
    }
}

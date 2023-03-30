import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Template } from '../app/template/template.entity';
import { CreateTemplateDto } from '../app/template/dto/create-template.dto';
import { TemplateFileService } from '../app/template/templateFile/templateFile.service';
import { FileService } from '../app/common/file/file.service';
import * as path from 'path';
import { FileData } from '../app/common/file/file.data';

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

    async run(
        entityManager: EntityManager,
        context: Dictionary,
    ): Promise<void> {
        const fileService = new FileService();
        const templateFileService = new TemplateFileService(fileService);

        const adminUser = context.user.admin;
        const upmmOntology = context.ontology.upmm;

        const waterfallTemplateFile = fileService.readFile(
            FileData.createFromFilePathWithName(
                TemplateSeeder.WATERFALL_TEMPLATE_BPMN_FILE,
            ),
        );

        const scrumTemplate = await Template.create(
            templateFileService,
            adminUser,
            upmmOntology,
            waterfallTemplateFile,
            new CreateTemplateDto('SCRUM'),
        );

        await entityManager.persistAndFlush(scrumTemplate);

        context.template = {
            scrum: scrumTemplate,
        };
    }
}

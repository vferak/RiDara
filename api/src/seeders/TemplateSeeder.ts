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
        entityManager: SqlEntityManager,
        context: Dictionary,
    ): Promise<void> {
        const bpmnService = new BpmnService();
        const fileService = new FileService();
        const templateFileService = new TemplateFileService(fileService);

        const templateNodeService = new TemplateNodeService(
            new TemplateNodeRepository(entityManager, TemplateNode),
            new OntologyNodeRepository(entityManager, OntologyNode),
        );

        const adminUser = context.user.admin;
        const upmmOntology = context.ontology.upmm;

        const waterfallTemplateFile = await bpmnService.changeStructureOfImportedFile(
            fileService.readFile(
                FileData.createFromFilePathWithName(
                    TemplateSeeder.WATERFALL_TEMPLATE_BPMN_FILE,
                ),
            ),
            await upmmOntology.getNodes(),
            [],
            true
        );

        const scrumTemplate = await Template.create(
            templateFileService,
            adminUser,
            upmmOntology,
            waterfallTemplateFile,
            new CreateTemplateDto('SCRUM'),
        );

        await entityManager.persistAndFlush(scrumTemplate);

        const allBpmnElements = (
            await bpmnService.parseBpmnFile(
                await scrumTemplate.getPublishedFileName(),
                false,
                false,
            )
        ).flatMap((obj) =>
            obj.getElements(),
        )

        await templateNodeService.createFromBpmnData(
            allBpmnElements,
            await scrumTemplate.getVersionPublished()
        );

        context.template = {
            scrum: scrumTemplate,
        };
    }
}

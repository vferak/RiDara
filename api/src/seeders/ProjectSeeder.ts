import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Project } from '../app/project/project.entity';
import { CreateProjectDto } from '../app/project/dto/create-project.dto';
import * as path from 'path';
import { FileService } from '../app/common/file/file.service';
import { FileData } from '../app/common/file/file.data';
import { ProjectFileService } from '../app/project/projectFile/projectFile.service';

export class ProjectSeeder extends Seeder {
    private static SEEDER_RESOURCES_FOLDER = path.join(
        process.cwd(),
        'src',
        'seeders',
        'resources',
    );

    private static FERAK_PROJECT_BPMN_FILE = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'FerakProject.bpmn',
    );

    private static BESTA_PROJECT_BPMN_FILE = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'BestaProject.bpmn',
    );

    private static SHARED_PROJECT_BPMN_FILE = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'SharedProject.bpmn',
    );

    async run(
        entityManager: EntityManager,
        context: Dictionary,
    ): Promise<void> {
        const fileService = new FileService();
        const projectFileService = new ProjectFileService(fileService);

        const scrumTemplate = context.template.scrum;

        const sharedWorkspace = context.workspace.shared;
        const sharedProjectFile = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.SHARED_PROJECT_BPMN_FILE,
            ),
        );

        const ferakUser = context.user.ferak;
        const ferakWorkspace = context.workspace.ferak;
        const ferakProjectFile = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.FERAK_PROJECT_BPMN_FILE,
            ),
        );

        const bestaUser = context.user.besta;
        const bestaWorkspace = context.workspace.besta;
        const bestaProjectFile = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.BESTA_PROJECT_BPMN_FILE,
            ),
        );

        const ferakProject = Project.create(
            projectFileService,
            new CreateProjectDto('Ferak project', ferakWorkspace),
            ferakUser,
            scrumTemplate,
            ferakProjectFile,
        );

        const bestaProject = Project.create(
            projectFileService,
            new CreateProjectDto('Besta project', bestaWorkspace),
            bestaUser,
            scrumTemplate,
            bestaProjectFile,
        );

        const sharedProject = Project.create(
            projectFileService,
            new CreateProjectDto('Shared project', sharedWorkspace),
            ferakUser,
            scrumTemplate,
            sharedProjectFile,
        );

        await entityManager.persistAndFlush([
            ferakProject,
            bestaProject,
            sharedProject,
        ]);

        context.project = {
            ferak: ferakProject,
            besta: bestaProject,
            shared: sharedProject,
        };
    }
}

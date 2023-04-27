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

    private static EXAMPLE_NO_ERRORS = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'DevelopmentNoErrorsProject.bpmn',
    );

    private static EXAMPLE_MISSING_ELEMENTS = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'DevelopmentMissingElements.bpmn',
    );

    private static EXAMPLE_BAD_SHAPES = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'DevelopmentBadShapes.bpmn',
    );

    private static EXAMPLE_BAD_RELATIONS = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'DevelopmentBadRelations.bpmn',
    );

    private static EXAMPLE_EXTRA_VALID_ELEMENTS = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'DevelopmentExtraValidElements.bpmn',
    );

    private static EXAMPLE_EXTRA_NOTVALID_ELEMENTS = path.join(
        ProjectSeeder.SEEDER_RESOURCES_FOLDER,
        'DevelopmentExtraNotValidElements.bpmn',
    );

    async run(
        entityManager: EntityManager,
        context: Dictionary,
    ): Promise<void> {
        const fileService = new FileService();
        const projectFileService = new ProjectFileService(fileService);

        const scrumTemplate = context.template.waterfall;
        const developmentTemplate = context.template.developmentProcessTemplate;

        const analyzeWorkspace = context.workspace.analyzeExamples;
        const analyzeNoErrorFile = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.EXAMPLE_NO_ERRORS,
            ),
        );
        const analyzeMissingElements = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.EXAMPLE_MISSING_ELEMENTS,
            ),
        );
        const analyzeBadShapes = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.EXAMPLE_BAD_SHAPES,
            ),
        );

        const analyzeBadRelations = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.EXAMPLE_BAD_RELATIONS,
            ),
        );

        const analyzeExtraValidElements = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.EXAMPLE_EXTRA_VALID_ELEMENTS,
            ),
        );
        const analyzeExtraNotValidElements = fileService.readFile(
            FileData.createFromFilePathWithName(
                ProjectSeeder.EXAMPLE_EXTRA_NOTVALID_ELEMENTS,
            ),
        );

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
        const adminUser = context.user.admin;
        const exampleProjectNoErrors = Project.create(
            projectFileService,
            new CreateProjectDto('Example no errors', analyzeWorkspace),
            adminUser,
            developmentTemplate,
            analyzeNoErrorFile,
        );

        const exampleProjectMissingElements = Project.create(
            projectFileService,
            new CreateProjectDto('Example missing elements', analyzeWorkspace),
            adminUser,
            developmentTemplate,
            analyzeMissingElements,
        );

        const exampleProjectBadShapes = Project.create(
            projectFileService,
            new CreateProjectDto(
                'Example bad shapes of elements',
                analyzeWorkspace,
            ),
            adminUser,
            developmentTemplate,
            analyzeBadShapes,
        );

        const exampleProjectBadRelations = Project.create(
            projectFileService,
            new CreateProjectDto(
                'Example bad relations of elements',
                analyzeWorkspace,
            ),
            adminUser,
            developmentTemplate,
            analyzeBadRelations,
        );

        const exampleProjectExtraValidElements = Project.create(
            projectFileService,
            new CreateProjectDto(
                'Example valid extra elements',
                analyzeWorkspace,
            ),
            adminUser,
            developmentTemplate,
            analyzeExtraValidElements,
        );

        const exampleProjectExtraNotValidElements = Project.create(
            projectFileService,
            new CreateProjectDto(
                'Example not valid extra elements',
                analyzeWorkspace,
            ),
            adminUser,
            developmentTemplate,
            analyzeExtraNotValidElements,
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
            exampleProjectNoErrors,
            exampleProjectMissingElements,
            exampleProjectBadShapes,
            exampleProjectBadRelations,
            exampleProjectExtraValidElements,
            exampleProjectExtraNotValidElements,
        ]);

        context.project = {
            ferak: ferakProject,
            besta: bestaProject,
            shared: sharedProject,
            exampleProjectNoErrors: exampleProjectNoErrors,
            exampleProjectMissingElements: exampleProjectMissingElements,
            exampleProjectBadShapes: exampleProjectBadShapes,
            exampleProjectBadRelations: exampleProjectBadRelations,
            exampleProjectExtraValidElements: exampleProjectExtraValidElements,
            exampleProjectExtraNotValidElements:
                exampleProjectExtraNotValidElements,
        };
    }
}

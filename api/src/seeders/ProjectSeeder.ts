import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Project } from '../app/project/project.entity';
import { CreateProjectDto } from '../app/project/dto/create-project.dto';
import * as path from 'path';
import { FileService } from '../app/common/file/file.service';
import { FileData } from '../app/common/file/file.data';
import { ProjectFileService } from '../app/project/projectFile/projectFile.service';
import { BpmnService } from '../app/bpmn/bpmn.service';
import { Template } from '../app/template/template.entity';
import { Workspace } from '../app/workspace/workspace.entity';
import { User } from 'src/app/shared/user/user.entity';

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

    private fileService: FileService = new FileService();
    private projectFileService: ProjectFileService = new ProjectFileService(this.fileService);
    private bpmnService: BpmnService = new BpmnService();

    async run(
        entityManager: EntityManager,
        context: Dictionary,
    ): Promise<void> {
        const waterfallTemplate = await context.template.waterfall;
        const developmentTemplate = await context.template.developmentProcessTemplate;

        const analyzeWorkspace = context.workspace.analyzeExamples;
        const sharedWorkspace = context.workspace.shared;
        const ferakWorkspace = context.workspace.ferak;
        const bestaWorkspace = context.workspace.besta;

        const ferakUser = context.user.ferak;
        const bestaUser = context.user.besta;
        const adminUser = context.user.admin;

        const exampleProjectNoErrors = await this.createProject(
            ProjectSeeder.EXAMPLE_NO_ERRORS,
            developmentTemplate,
            analyzeWorkspace,
            adminUser,
            'Example no errors',
        );

        const exampleProjectMissingElements = await this.createProject(
            ProjectSeeder.EXAMPLE_MISSING_ELEMENTS,
            developmentTemplate,
            analyzeWorkspace,
            adminUser,
            'Example missing elements',
        );

        const exampleProjectBadShapes = await this.createProject(
            ProjectSeeder.EXAMPLE_BAD_SHAPES,
            developmentTemplate,
            analyzeWorkspace,
            adminUser,
            'Example bad shapes of elements',
        );

        const exampleProjectBadRelations = await this.createProject(
            ProjectSeeder.EXAMPLE_BAD_RELATIONS,
            developmentTemplate,
            analyzeWorkspace,
            adminUser,
            'Example bad relations of elements',
        );

        const exampleProjectExtraValidElements = await this.createProject(
            ProjectSeeder.EXAMPLE_EXTRA_VALID_ELEMENTS,
            developmentTemplate,
            analyzeWorkspace,
            adminUser,
            'Example valid extra elements',
        );

        const exampleProjectExtraNotValidElements = await this.createProject(
            ProjectSeeder.EXAMPLE_EXTRA_NOTVALID_ELEMENTS,
            developmentTemplate,
            analyzeWorkspace,
            adminUser,
            'Example not valid extra elements',
        );

        const ferakProject = await this.createProject(
            ProjectSeeder.FERAK_PROJECT_BPMN_FILE,
            waterfallTemplate,
            ferakWorkspace,
            ferakUser,
            'Ferak project',
        );

        const bestaProject = await this.createProject(
            ProjectSeeder.BESTA_PROJECT_BPMN_FILE,
            waterfallTemplate,
            bestaWorkspace,
            bestaUser,
            'Besta project',
        );

        const sharedProject= await this.createProject(
            ProjectSeeder.SHARED_PROJECT_BPMN_FILE,
            waterfallTemplate,
            sharedWorkspace,
            ferakUser,
            'Shared project',
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

    private async createProject(
        projectFileName: string,
        template: Template,
        workspace: Workspace,
        user: User,
        projectName: string,
    ): Promise<Project> {
        const publishedTemplateVersion = await template.getVersionPublished();

        const fileBuffer = await this.bpmnService.changeStructureOfImportedFile(
            this.fileService.readFile(
                FileData.createFromFilePathWithName(
                    projectFileName,
                ),
            ),
            await template.getOntologyFile().getNodes(),
            await publishedTemplateVersion.getNodes(),
            false,
        );

        return Project.create(
            this.projectFileService,
            new CreateProjectDto(projectName, workspace),
            user,
            publishedTemplateVersion,
            fileBuffer,
        );
    }
}

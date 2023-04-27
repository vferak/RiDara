import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../shared/user/user.entity';
import { Project } from './project.entity';
import { ProjectByUuidPipe } from './pipes/project-by-uuid.pipe';
import { CreateProjectDto } from './dto/create-project.dto';
import { Express } from 'express';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AnalyzeService } from '../shared/analyze/analyze.service';
import { BpmnService } from '../bpmn/bpmn.service';
import { OntologyService } from '../ontology/ontology.service';
import { TemplateService } from '../template/template.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { AnalyzedJsonData } from '../shared/analyze/analyzedJson.data';
import { AnalyzeData } from '../shared/analyze/analyze.data';
import { FileService } from '../common/file/file.service';
import { FileData } from '../common/file/file.data';
import { BPMN_BLANK_FILE_PATH } from '../common/file/file.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { EntityManager } from '@mikro-orm/mariadb';
import { BpmnElementData } from '../bpmn/bpmnElement.data';
import { TemplateVersion } from '../template/templateVersion/templateVersion.entity';

@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly analyzeService: AnalyzeService,
        private readonly bpmnService: BpmnService,
        private readonly templateService: TemplateService,
        private readonly ontologyService: OntologyService,
        private readonly workspaceService: WorkspaceService,
        private readonly fileService: FileService,
        private readonly entityManager: EntityManager,
    ) {}

    @Post('')
    public async create(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
        @Body('templateUuid') templateUuid: string,
        @Body('blankFile') blank: boolean,
    ): Promise<Project> {
        const template = await this.templateService.getOneByUuid(templateUuid);
        let file: Buffer;
        const fileName = blank
            ? BPMN_BLANK_FILE_PATH
            : await template.getPublishedFileName();

        if (!blank) {
            const bpmnFileData = await this.bpmnService.reverseParseBpmnFile(
                fileName,
                await template.getVersionPublished(),
            );
            file = Buffer.from(bpmnFileData);
        } else {
            file = this.fileService.readFile(
                FileData.createFromFilePathWithName(fileName),
            );
        }

        return this.projectService.create(
            createProjectDto,
            user,
            template,
            file,
        );
    }

    @Patch('update/:uuid')
    public async update(
        @Param('uuid', ProjectByUuidPipe) project: Project,
        @Body() updateProjectDto: UpdateProjectDto,
        @Body('templateUuid') templateUuid: string,
    ): Promise<Project> {
        let templateVersion: TemplateVersion;

        if (project.getTemplate().getUuid() === templateUuid) {
            templateVersion = project.getTemplateVersion();
        } else {
            templateVersion = await (
                await this.templateService.getOneByUuid(templateUuid)
            ).getVersionPublished();
        }

        const workspace = await this.workspaceService.getOneByUuid(
            updateProjectDto.workspace,
        );

        return this.projectService.update(
            project,
            updateProjectDto,
            workspace,
            templateVersion,
        );
    }

    @Get('workspace/:uuid')
    public async getProjectsByWorkspace(
        @Param('uuid') workspaceUuid: string,
    ): Promise<Project[]> {
        const workspace = await this.workspaceService.getOneByUuid(
            workspaceUuid,
        );
        return workspace.getProjects();
    }

    @Delete('/delete')
    public async deleteProject(
        @Body('projectUuid') projectUuid: string,
    ): Promise<void> {
        const project = await this.projectService.getOneByUuid(projectUuid);
        await project.remove(this.entityManager);
    }

    @Get(':uuid/nodes')
    public async getNodesByProject(
        @Param('uuid', ProjectByUuidPipe) project: Project,
    ): Promise<object[]> {
        return await project.getNodesForBpmnDropdown();
    }

    @Get(':uuid/file')
    public async getProjectFile(
        @Param('uuid') projectUuid: string,
    ): Promise<string> {
        const project = await this.projectService.getOneByUuid(projectUuid);
        return this.fileService
            .readFile(FileData.createFromFilePathWithName(project.getPath()))
            .toString();
    }

    @Patch('saveFile')
    public async saveProjectFile(
        @Body('projectUuid') projectUuid: string,
        @Body('bpmnFileData') bpmnFileData: string,
    ): Promise<void> {
        const project = await this.projectService.getOneByUuid(projectUuid);
        this.fileService.writeFile(
            FileData.createFromFilePathWithName(project.getPath()),
            bpmnFileData,
        );
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    public async importFile(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
        @UploadedFile() file: Express.Multer.File,
        @Body('templateUuid') templateUuid: string,
    ): Promise<Project> {
        const template = await this.templateService.getOneByUuid(templateUuid);
        const allNodesByTemplate = await template.getOntologyFile().getNodes();
        const templateVersion = await template.getVersionPublished();
        const allTemplateNodes = await templateVersion.getNodes();
        const newBuffer = await this.bpmnService.changeStructureOfImportedFile(
            file.buffer,
            allNodesByTemplate,
            allTemplateNodes,
            false,
        );

        return await this.projectService.create(
            createProjectDto,
            user,
            template,
            newBuffer,
        );
    }

    @Get(':uuid/analyze')
    public async analyze(
        @Param('uuid', ProjectByUuidPipe) project: Project,
    ): Promise<AnalyzedJsonData> {
        let analyzedData: AnalyzeData;

        const bpmnProjectData = await this.bpmnService.parseBpmnFile(
            project.getPath(),
            false,
            false,
        );
        const allBpmnProjectElementData: BpmnElementData[] =
            bpmnProjectData.flatMap((obj) => obj.getElements());

        const templateBpmnData = await this.bpmnService.parseBpmnFile(
            project.getTemplateFileName(),
            false,
            false,
        );
        const allBpmnTemplateElementData: BpmnElementData[] =
            templateBpmnData.flatMap((obj) => obj.getElements());

        const secondLevelBpmnData = allBpmnProjectElementData;

        const templateNodesNames =
            await this.ontologyService.getNodesByBPMNData(
                allBpmnTemplateElementData,
            );

        const projectNodesNames = await this.ontologyService.getNodesByBPMNData(
            allBpmnProjectElementData,
        );

        analyzedData = await this.analyzeService.firstLevelAnalyze(
            projectNodesNames,
            templateNodesNames,
        );

        const firstLevelPercent = analyzedData.getPercentArray()[0];
        if (firstLevelPercent === 100) {
            analyzedData = await this.analyzeService.secondLevelAnalyze(
                secondLevelBpmnData,
                allBpmnTemplateElementData,
                analyzedData,
            );

            const secondLevelPercent = analyzedData.getPercentArray()[1];

            if (secondLevelPercent === 100) {
                analyzedData = await this.analyzeService.thirdLevelAnalyze(
                    secondLevelBpmnData,
                    allBpmnTemplateElementData,
                    analyzedData,
                    project.getTemplateVersion(),
                );
                if (analyzedData.getRelationErrorData().length >= 1) {
                    const specialProjectBpmnData =
                        await this.bpmnService.parseBpmnFile(
                            project.getPath(),
                            false,
                            true,
                        );

                    const fourthLevelBpmnProjectData: BpmnElementData[] =
                        specialProjectBpmnData.flatMap((obj) =>
                            obj.getElements(),
                        );
                    analyzedData = await this.analyzeService.fourthLevelAnalyze(
                        fourthLevelBpmnProjectData,
                        analyzedData,
                    );

                    analyzedData =
                        await this.analyzeService.removeEmptyErrorData(
                            analyzedData,
                        );
                    const percent =
                        (1 -
                            analyzedData.getRelationErrorData().length /
                                allBpmnTemplateElementData.length) *
                        100;
                    analyzedData.setPercentArray([100, 100, percent]);
                }
            }
        }

        const percentArray = analyzedData.getPercentArray();
        const missingToJson = analyzedData.mapToJson(
            analyzedData.getMissingMap(),
        );
        const notRecognizedToJson = analyzedData.mapToJson(
            analyzedData.getNotRecognizedMap(),
        );
        const overExtendsToJson = analyzedData.mapToJson(
            analyzedData.getOverExtendsMap(),
        );
        const shapeToJson = analyzedData.mapToJson(analyzedData.getShapeMap());

        const relationErrorData = analyzedData.relationErrorDataValuesToJson(
            analyzedData.getRelationErrorData(),
        );

        const analyzeJsonData = new AnalyzedJsonData(
            percentArray,
            missingToJson,
            notRecognizedToJson,
            overExtendsToJson,
            shapeToJson,
            relationErrorData,
        );

        return analyzeJsonData;
    }
}

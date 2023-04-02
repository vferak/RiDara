import {
    Body,
    Controller,
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
import { OntologyNode } from '../ontology/ontologyNode/ontologyNode.entity';
import { WorkspaceService } from '../workspace/workspace.service';
import { AnalyzedJsonData } from '../shared/analyze/analyzedJson.data';
import { AnalyzeData } from '../shared/analyze/analyze.data';
import { FileService } from '../common/file/file.service';
import { FileData } from '../common/file/file.data';
import { BPMN_BLANK_FILE_PATH } from '../common/file/file.constants';
import { FileInterceptor } from '@nestjs/platform-express';

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
    ) {}

    @Post('')
    public async create(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
        @Body('templateUuid') templateUuid: string,
        @Body('blankFile') blank: boolean,
    ): Promise<Project> {
        const template = await this.templateService.getOneByUuid(templateUuid);

        const fileName = blank
            ? BPMN_BLANK_FILE_PATH
            : await template.getPublishedFileName();

        const file = this.fileService.readFile(
            FileData.createFromFilePathWithName(fileName),
        );

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
        const template = await this.templateService.getOneByUuid(templateUuid);
        const workspace = await this.workspaceService.getOneByUuid(
            updateProjectDto.workspace,
        );
        return this.projectService.update(
            project,
            updateProjectDto,
            workspace,
            template,
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

    /*@Get(':uuid')
    public async projectDetail(
        @Param('uuid', ProjectByUuidPipe) project: Project,
    ): Promise<Project> {
        return project;
    }*/

    @Get(':uuid/nodes')
    public async getNodesByProject(
        @Param('uuid', ProjectByUuidPipe) project: Project,
    ): Promise<OntologyNode[]> {
        const projectVersion = await project
            .getTemplate()
            .getVersionPublished();
        const nodes = await projectVersion.getOntologyNodes();
        return nodes.sort((a, b) => {
            const aName = a.getName().toUpperCase();
            const bName = b.getName().toUpperCase();

            return aName > bName ? 1 : bName > aName ? -1 : 0;
        });
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

        return await this.projectService.create(
            createProjectDto,
            user,
            template,
            file.buffer,
        );
    }

    @Get(':uuid/analyze')
    public async analyze(
        @Param('uuid', ProjectByUuidPipe) project: Project,
    ): Promise<AnalyzedJsonData> {
        let analyzedData: AnalyzeData;

        const bpmnData = await this.bpmnService.parseBpmnFile(
            project.getPath(),
        );

        const templateBpmnData = await this.bpmnService.parseBpmnFile(
            await project.getTemplate().getPublishedFileName(),
        );
        const secondLevelBpmnData = bpmnData.getElements();

        const publishedTemplateVersion = await project
            .getTemplate()
            .getVersionPublished();

        const templateNodes = await publishedTemplateVersion.getOntologyNodes();
        const templateNodesMap = await this.ontologyService.parseOntologyNodes(
            templateNodes,
        );

        const projectNodesMap = await this.ontologyService.getProjectNodes(
            bpmnData,
        );

        analyzedData = await this.analyzeService.firstLevelAnalyze(
            projectNodesMap,
            templateNodesMap,
        );

        const firstLevelPercent = analyzedData.getPercentArray()[0];
        if (firstLevelPercent === 100) {
            analyzedData = await this.analyzeService.secondLevelAnalyze(
                secondLevelBpmnData,
                templateBpmnData.getElements(),
                analyzedData,
            );

            const secondLevelPercent = analyzedData.getPercentArray()[0];

            if (secondLevelPercent === 100) {
                analyzedData = await this.analyzeService.thirdLevelAnalyze(
                    secondLevelBpmnData,
                    templateBpmnData.getElements(),
                    analyzedData,
                );
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

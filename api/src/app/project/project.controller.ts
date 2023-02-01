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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProjectDto } from './dto/create-project.dto';
import { Express } from 'express';
import { UpdateProjectDto } from './dto/update-project.dto';
import * as fs from 'fs';
import { AnalyzeService } from '../shared/analyze/analyze.service';
import { BpmnService } from '../bpmn/bpmn.service';
import { OntologyService } from '../ontology/ontology.service';
import { TemplateService } from '../template/template.service';
import * as path from 'path';
import { BpmnData } from '../bpmn/bpmn.data';
import { OntologyNode } from '../ontology/ontologyNode/ontologyNode.entity';

@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly analyzeService: AnalyzeService,
        private readonly bpmnService: BpmnService,
        private readonly templateService: TemplateService,
        private readonly ontologyService: OntologyService,
    ) {}

    @Post('')
    public async create(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
        @Body('templateUuid') templateUuid: string,
        @Body('blankFile') blank: boolean,
    ): Promise<Project> {
        let templateFile;
        const template = await this.templateService.getOneByUuid(templateUuid);
        const bpmnResourcesPath = path.join(process.cwd(), 'resources', 'bpmn');

        if (blank) {
            templateFile = path.join(bpmnResourcesPath, 'blank.bpmn');
        } else {
            templateFile = template.getFileName();
        }
        const fileName = createProjectDto.name + Date.now() + '.bpmn';
        const pathToFile = path.join(bpmnResourcesPath, 'project', fileName);

        fs.copyFileSync(templateFile, pathToFile);
        createProjectDto.path = pathToFile;
        return this.projectService.create(createProjectDto, user, template);
    }

    @Patch('update/:uuid')
    public async update(
        @Param('uuid', ProjectByUuidPipe) project: Project,
        @Body() updateProjectDto: UpdateProjectDto,
    ): Promise<Project> {
        return this.projectService.update(project, updateProjectDto);
    }

    @Get('user/:uuid')
    public async displayUsersProjects(
        @CurrentUser() user: User,
    ): Promise<Project[]> {
        return user.getProjects();
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
        return project.getTemplate().getOntologyFile().getNodes();
    }

    @Get(':uuid/file')
    public async getProjectFile(
        @Param('uuid') projectUuid: string,
    ): Promise<string> {
        const project = await this.projectService.getOneByUuid(projectUuid);
        return fs.readFileSync(project.getPath()).toString();
    }

    @Patch('saveFile')
    public async saveProjectFile(
        @Body('projectUuid') projectUuid: string,
        @Body('bpmnFileData') bpmnFileData: string,
    ): Promise<void> {
        const project = await this.projectService.getOneByUuid(projectUuid);
        fs.writeFileSync(project.getPath(), bpmnFileData);
    }

    /* @Post('import')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: function (req, file, cb) {
                    cb(null, './resources/bpmn/');
                },
                filename: function (req, file, cb) {
                    cb(null, file.originalname);
                },
            }),
        }),
    )
    async uploadedFile(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
        @UploadedFile() file: Express.Multer.File,
    ) {
        createProjectDto.path = './' + file.path;
        const project = await this.projectService.create(
            createProjectDto,
            user,
        );
        return project;
    }*/

    @Get(':uuid/analyze1')
    public async firstLevelAnalyze(
        @Param('uuid', ProjectByUuidPipe) project: Project,
    ): Promise<Array<any>[]> {
        const [parsedFileData, totalNodes] =
            await this.bpmnService.parseBpmnFile(project.getPath());

        const ontologyFile = project.getTemplate().getOntologyFile();
        const templateNodes = await ontologyFile.getNodes();
        const templateNodesMap = await this.bpmnService.parseOntologyNodes(
            templateNodes,
        );
        const bpmnData = new BpmnData(totalNodes, parsedFileData);

        const [percent, maps] = await this.analyzeService.firstLevelAnalyze(
            bpmnData,
            templateNodesMap,
            {},
        );

        return [percent, maps];
    }
}

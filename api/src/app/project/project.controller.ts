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
import { TemplateService } from '../template/template.service';

@Controller('project')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
        private readonly templateService: TemplateService,
    ) {}

    @Post('')
    public async create(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
        @Body('templateUuid') templateUuid: string,
    ): Promise<Project> {
        const pathToFile = './resources/bpmn/';
        const fullPath =
            pathToFile +
            user.getFirstName() +
            user.getLastName() +
            Date.now() +
            '.bpmn';
        fs.writeFile(`${fullPath}`, '', function (err) {
            if (err) {
                return console.error(err);
            }
        });

        const template = await this.templateService.getOneByUuid(templateUuid);
        createProjectDto.path = fullPath;
        return this.projectService.create(createProjectDto, user, template);
    }

    @Patch(':uuid')
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

    @Get(':uuid')
    public async projectDetail(
        @Param('uuid', ProjectByUuidPipe) project: Project,
    ): Promise<Project> {
        return project;
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
}

import {
    Body,
    Controller,
    Get,
    Param,
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

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Post('')
    public async create(
        @Body() createProjectDto: CreateProjectDto,
        @CurrentUser() user: User,
    ): Promise<Project> {
        return this.projectService.create(createProjectDto, user);
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
    @Post('import')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: function (req, file, cb) {
                    cb(null, './public/data/uploads/');
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
        createProjectDto.path = file.path;
        const project = await this.projectService.create(
            createProjectDto,
            user,
        );
        return project;
    }
}

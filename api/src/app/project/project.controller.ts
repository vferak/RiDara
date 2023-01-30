import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../shared/user/user.entity';
import { Project } from './project.entity';
import { ProjectByUuidPipe } from './pipes/project-by-uuid.pipe';

@Controller('project')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get('user/:uuid')
    public async displayUsersProjects(@CurrentUser() user: User): Promise<Project[]> {
        return user.getProjects();
    }

    @Get(':uuid')
    public async projectDetail(
        @Param('uuid', ProjectByUuidPipe) project: Project,
    ): Promise<Project> {
        return project;
    }
}

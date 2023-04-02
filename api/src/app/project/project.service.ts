import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../shared/user/user.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Template } from '../template/template.entity';
import { Workspace } from '../workspace/workspace.entity';
import { ProjectFileService } from './projectFile/projectFile.service';

@Injectable()
export class ProjectService {
    public constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectFileService: ProjectFileService,
    ) {}

    public async getOneByUuid(uuid: string): Promise<Project> {
        return await this.projectRepository.findOneOrFail({ uuid: uuid });
    }

    public async create(
        createProjectDto: CreateProjectDto,
        user: User,
        template: Template,
        file: Buffer,
    ): Promise<Project> {
        const project = Project.create(
            this.projectFileService,
            createProjectDto,
            user,
            template,
            file,
        );

        this.projectRepository.persist(project);
        await this.projectRepository.flush();

        return project;
    }

    public async update(
        project: Project,
        updateProjectDto: UpdateProjectDto,
        workspace: Workspace,
        template: Template,
    ): Promise<Project> {
        project.update(updateProjectDto, workspace, template);
        await this.projectRepository.flush();
        return project;
    }
}

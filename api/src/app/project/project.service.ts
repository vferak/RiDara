import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../shared/user/user.entity';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async getOneByUuid(uuid: string): Promise<Project> {
        return await this.projectRepository.findOneOrFail({ uuid: uuid });
    }

    public async create(
        createProjectDto: CreateProjectDto,
        user: User,
    ): Promise<Project> {
        const project = Project.create(createProjectDto, user);
        this.projectRepository.persist(project);
        await this.projectRepository.flush();

        return project;
    }

    public async update(
        project: Project,
        updateProjectDto: UpdateProjectDto,
    ): Promise<Project> {
        project.update(updateProjectDto);
        await this.projectRepository.flush();
        return project;
    }
}

import { Injectable } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { Project } from './project.entity';

@Injectable()
export class ProjectService {
    public constructor(private readonly projectRepository: ProjectRepository) {}

    public async getOneByUuid(uuid: string): Promise<Project> {
        return this.projectRepository.findOneOrFail({ uuid: uuid });
    }
}

import { Injectable, PipeTransform } from '@nestjs/common';
import { ProjectService } from '../project.service';
import { Project } from '../project.entity';

@Injectable()
export class ProjectByUuidPipe
    implements PipeTransform<string, Promise<Project>>
{
    public constructor(private readonly projectService: ProjectService) {}

    public async transform(value: string): Promise<Project> {
        return this.projectService.getOneByUuid(value);
    }
}

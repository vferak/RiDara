import { Injectable, PipeTransform } from '@nestjs/common';
import { Workspace } from '../workspace.entity';
import { WorkspaceService } from '../workspace.service';

@Injectable()
export class WorkspaceByUuidPipe
    implements PipeTransform<string, Promise<Workspace>>
{
    public constructor(private readonly workspaceService: WorkspaceService) {}

    public async transform(value: string): Promise<Workspace> {
        return this.workspaceService.getOneByUuid(value);
    }
}

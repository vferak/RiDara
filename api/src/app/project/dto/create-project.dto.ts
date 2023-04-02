import { Workspace } from '../../workspace/workspace.entity';

export class CreateProjectDto {
    public constructor(public name: string, public workspace: Workspace) {}
}

import { Workspace } from '../../workspace/workspace.entity';
import { User } from '../../shared/user/user.entity';

export class CreateProjectDto {
    public constructor(
        public name: string,
        public path: string,
        public user: User,
        public workspace: Workspace,
    ) {}
}

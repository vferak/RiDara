import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserWorkspace } from './userWorkspace.entity';
import { UserWorkspaceRepository } from './userWorkspace.repository';
import { Workspace } from '../workspace/workspace.entity';
import { EntityManager } from '@mikro-orm/mariadb';


@Injectable()
export class UserWorkspaceService {
    public constructor(
        private readonly userWorkspaceRepository: UserWorkspaceRepository,
        private readonly entityManager: EntityManager,
    ) {}

    public async getOneByUserAndWorkspace(user: User, workspace: Workspace):Promise<UserWorkspace>{
        return await this.userWorkspaceRepository.findOneOrFail({
            workspace: workspace,
            user: user,
        });

    }

    public async getAllByWorkspace(workspace: Workspace):Promise<UserWorkspace[]>{
        return await this.userWorkspaceRepository.find({
            workspace: workspace,
        });
    }

    public async removeAllUsers(userWorkspaces: UserWorkspace[]): Promise<void> {
        for(const userWorkspace of userWorkspaces)
        {
            await userWorkspace.remove(this.entityManager);
        }
        await this.userWorkspaceRepository.flush();
    }

    public async remove(userWorkspace: UserWorkspace): Promise<void> {
        await userWorkspace.remove(this.entityManager);
        await this.userWorkspaceRepository.flush();
    }
}

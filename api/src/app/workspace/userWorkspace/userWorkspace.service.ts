import { Injectable } from '@nestjs/common';
import { UserWorkspace } from './userWorkspace.entity';
import { UserWorkspaceRepository } from './userWorkspace.repository';
import { EntityManager } from '@mikro-orm/mariadb';
import { User } from '../../shared/user/user.entity';
import { Workspace } from '../workspace.entity';

@Injectable()
export class UserWorkspaceService {
    public constructor(
        private readonly userWorkspaceRepository: UserWorkspaceRepository,
        private readonly entityManager: EntityManager,
    ) {}

    public async getOneByUserAndWorkspace(
        user: User,
        workspace: Workspace,
    ): Promise<UserWorkspace> {
        return await this.userWorkspaceRepository.findOneOrFail({
            workspace: workspace,
            user: user,
        });
    }

    public async remove(userWorkspace: UserWorkspace): Promise<void> {
        await userWorkspace.remove(this.entityManager);
        await this.userWorkspaceRepository.flush();
    }

    public async removeAllUsers(userWorkspaces: UserWorkspace[]): Promise<void> {
        for(const userWorkspace of userWorkspaces)
        {
            await userWorkspace.remove(this.entityManager);
        }
        await this.userWorkspaceRepository.flush();
    }
}

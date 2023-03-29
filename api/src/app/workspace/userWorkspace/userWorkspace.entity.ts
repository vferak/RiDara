import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    Property,
} from '@mikro-orm/core';
import { UserWorkspaceRepository } from './userWorkspace.repository';
import { BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mariadb';
import { Workspace } from '../workspace.entity';
import { User } from '../../shared/user/user.entity';

@Entity({ customRepository: () => UserWorkspaceRepository })
export class UserWorkspace {
    [EntityRepositoryType]?: UserWorkspaceRepository;

    @ManyToOne({ primary: true, entity: () => Workspace, eager: true })
    private workspace: Workspace;

    @ManyToOne({ primary: true, entity: () => User, eager: true })
    private user: User;

    @Property()
    private role!: string;

    private constructor(workspace: Workspace, user: User, role: string) {
        this.workspace = workspace;
        this.user = user;
        this.role = role;
    }

    public static async create(
        workspace: Workspace,
        user: User,
    ): Promise<UserWorkspace> {
        const workspaceUsers = await workspace.getUsers();

        for (const workspaceUser of workspaceUsers) {
            if (workspaceUser.getUuid() === user.getUuid()) {
                throw new BadRequestException('User already in workspace');
            }
        }

        return new UserWorkspace(workspace, user, 'admin');
    }

    public getWorkspace(): Workspace {
        return this.workspace;
    }

    public getUser(): User {
        return this.user;
    }

    public getRole(): string {
        return this.role;
    }

    public async remove(entityManager: EntityManager): Promise<void> {
        const workspace = this.workspace;
        entityManager.remove(this);

        const users = await workspace.getUsers();
        if (users.length === 0) {
            workspace.remove(entityManager);
        }
    }
}

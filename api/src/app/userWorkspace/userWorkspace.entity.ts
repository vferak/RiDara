import {
    Entity, EntityRepositoryType,
    ManyToOne,
    Property,
} from '@mikro-orm/core';
import { User } from '../user/user.entity';
import { Workspace } from '../workspace/workspace.entity';
import { UserWorkspaceRepository } from './userWorkspace.repository';

@Entity({ customRepository: () => UserWorkspaceRepository })
export class UserWorkspace {
    [EntityRepositoryType]?: UserWorkspaceRepository;

    @ManyToOne({ primary: true, entity: () => Workspace })
    private workspace: Workspace;

    @ManyToOne({ primary: true, entity: () => User })
    private user: User;

    @Property()
    private role!: string;

    private constructor(workspace: Workspace, user: User, role: string) {
        this.workspace = workspace;
        this.user = user;
        this.role = role;
        workspace.addUserWorkspace(this);
        user.addUserWorkspace(this);
    }

    public static create(
        workspace: Workspace,
        user: User,
        role: string,
    ): UserWorkspace {
        return new UserWorkspace(workspace, user, role);
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
}

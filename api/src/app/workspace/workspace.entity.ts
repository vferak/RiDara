import {
    Collection,
    Entity,
    EntityRepositoryType,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from '../user/user.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { UserWorkspace } from '../userWorkspace/userWorkspace.entity';
import { WorkspaceRepository } from './workspace.repository';
import { EntityManager } from '@mikro-orm/mariadb';

@Entity({ customRepository: () => WorkspaceRepository })
export class Workspace {
    [EntityRepositoryType]?: WorkspaceRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private name!: string;

    @ManyToOne({ entity: () => User, eager: true })
    private owner!: User;

    @OneToMany('UserWorkspace', 'workspace')
    private userWorkspaces = new Collection<UserWorkspace>(this);

    private constructor(uuid: string, name: string, owner: User) {
        this.uuid = uuid;
        this.name = name;
        this.owner = owner;
    }

    public static create(
        createWorkspaceDto: CreateWorkspaceDto,
        owner: User,
    ): Workspace {
        const uuid = v4();
        return new Workspace(uuid, createWorkspaceDto.name, owner);
    }

    public update(updateWorkspaceDto: UpdateWorkspaceDto): void {
        this.name = updateWorkspaceDto.name;
    }

    public getName(): string {
        return this.name;
    }

    public getOwner(): User {
        return this.owner;
    }

    public getUuid(): string {
        return this.uuid;
    }

    public async getUsers(): Promise<User[]> {
        await this.userWorkspaces.init();
        return this.userWorkspaces
            .getItems()
            .map((userWorkspace: UserWorkspace) => userWorkspace.getUser());
    }

    public addUserWorkspace(userWorkspace: UserWorkspace): void {
        this.userWorkspaces.add(userWorkspace);
    }

    public remove(entityManager: EntityManager): void {
        entityManager.remove(this);
    }
}

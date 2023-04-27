import {
    Collection,
    Entity,
    EntityRepositoryType,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { WorkspaceRepository } from './workspace.repository';
import { EntityManager } from '@mikro-orm/mariadb';
import { User } from '../shared/user/user.entity';
import { UserWorkspace } from './userWorkspace/userWorkspace.entity';
import { Project } from '../project/project.entity';
import { Uuid } from '../common/uuid/uuid';
import { UuidInterface } from '../common/uuid/uuid.interface';
import { OntologyNode } from '../ontology/ontologyNode/ontologyNode.entity';

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

    @OneToMany('Project', 'workspace')
    private projects = new Collection<Project>(this);

    private constructor(uuid: UuidInterface, name: string, owner: User) {
        this.uuid = uuid.asString();
        this.name = name;
        this.owner = owner;
    }

    public static async create(
        createWorkspaceDto: CreateWorkspaceDto,
        owner: User,
    ): Promise<Workspace> {
        const uuid = Uuid.createV4();
        const workspace = new Workspace(uuid, createWorkspaceDto.name, owner);

        await UserWorkspace.create(workspace, owner);

        return workspace;
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
        if (!this.userWorkspaces.isInitialized()) {
            await this.userWorkspaces.init();
        }

        return this.userWorkspaces
            .getItems()
            .map((userWorkspace: UserWorkspace) => userWorkspace.getUser());
    }

    public remove(entityManager: EntityManager): void {
        entityManager.remove(this);
    }

    public async getProjects(): Promise<Project[]> {
        return this.projects.loadItems();
    }

    public async getProjectsSorted(): Promise<Project[]> {
        return (await this.getProjects()).sort(
            (a: Project, b: Project): number => {
            const aName = a.getName();
            const bName = b.getName();

            return aName > bName ? 1 : bName > aName ? -1 : 0;
        });
    }


    public async getUserWorkspaces(): Promise<UserWorkspace[]> {
        return this.userWorkspaces.loadItems();
    }

    public async getUserWorkspacesSortedByUserName(): Promise<UserWorkspace[]> {
        return (await this.getUserWorkspaces()).sort(
            (a: UserWorkspace, b: UserWorkspace): number => {
                const aName = a.getUser().getFullName();
                const bName = b.getUser().getFullName();

                return aName > bName ? 1 : bName > aName ? -1 : 0;
            }
        );
    }

    public async addUser(user: User): Promise<UserWorkspace> {
        return await UserWorkspace.create(this, user);
    }
}

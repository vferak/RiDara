import {
    Collection,
    Entity,
    EntityRepositoryType,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { UserWorkspace } from '../../workspace/userWorkspace/userWorkspace.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Workspace } from '../../workspace/workspace.entity';
import { Project } from '../../project/project.entity';
import { Template } from '../../template/template.entity';

@Entity({ customRepository: () => UserRepository })
export class User {
    [EntityRepositoryType]?: UserRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private email!: string;

    @Property()
    private firstName!: string;

    @Property()
    private lastName!: string;

    @Property()
    private password!: string;

    @Property()
    private createDate!: Date;

    @OneToMany('UserWorkspace', 'user')
    private userWorkspaces = new Collection<UserWorkspace>(this);

    @OneToMany('Project', 'owner')
    private projects = new Collection<Project>(this);

    @OneToMany('Template', 'author')
    private templates = new Collection<Template>(this);

    private constructor(
        uuid: string,
        email: string,
        firstName: string,
        lastName: string,
        password: string,
        createDate: Date,
    ) {
        this.uuid = uuid;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.createDate = createDate;
    }

    public static create(createUserDto: CreateUserDto): User {
        const uuid = v4();
        const date = new Date();
        return new User(
            uuid,
            createUserDto.email,
            createUserDto.firstName,
            createUserDto.lastName,
            createUserDto.password,
            date,
        );
    }

    public update(updateUserDto: UpdateUserDto): void {
        this.email = updateUserDto.email;
        this.firstName = updateUserDto.firstName;
        this.lastName = updateUserDto.lastName;
    }

    public updatePassword(updateUserDto: UpdateUserDto): void {
        this.password = updateUserDto.password;
    }
    public getEmail(): string {
        return this.email;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public async getWorkspaces(): Promise<Workspace[]> {
        await this.userWorkspaces.init();
        return this.userWorkspaces
            .getItems()
            .map((userWorkspace: UserWorkspace) =>
                userWorkspace.getWorkspace(),
            );
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getPassword(): string {
        return this.password;
    }
    public addUserWorkspace(userWorkspace: UserWorkspace): void {
        this.userWorkspaces.add(userWorkspace);
    }

    public async getProjects(): Promise<Project[]> {
        await this.projects.init();
        return this.projects.getItems();
    }

    public async getTemplates(): Promise<Template[]> {
        await this.templates.init();
        return this.templates.getItems();
    }
}

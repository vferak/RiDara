import {
    Collection,
    Entity,
    EntityRepositoryType,
    Enum,
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
import { UserRole } from './role/userRole.enum';
import { BcryptService } from '../../common/providers/bcrypt.service';
import { OntologyFile } from '../../ontology/ontologyFile/ontologyFile.entity';

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

    @Enum(() => UserRole)
    private role: UserRole;

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
        role: UserRole,
    ) {
        this.uuid = uuid;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.createDate = createDate;
        this.role = role;
    }

    public static async create(
        bcryptService: BcryptService,
        createUserDto: CreateUserDto,
    ): Promise<User> {
        const uuid = v4();
        const date = new Date();
        const password = await bcryptService.hash(createUserDto.password);

        return new User(
            uuid,
            createUserDto.email,
            createUserDto.firstName,
            createUserDto.lastName,
            password,
            date,
            UserRole.BASIC,
        );
    }

    public update(updateUserDto: UpdateUserDto): void {
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

    public getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public async getWorkspaces(): Promise<Workspace[]> {
        return (await this.userWorkspaces.loadItems())
            .map((userWorkspace: UserWorkspace) =>
                userWorkspace.getWorkspace(),
            );
    }

    public async getWorkspacesSorted(): Promise<Workspace[]> {
        return (await this.getWorkspaces())
            .sort(
                (a: Workspace, b: Workspace): number => {
                    const aName = a.getName();
                    const bName = b.getName();
                    return aName > bName ? 1 : bName > aName ? -1 : 0;
                }
            );
    }



    public getUuid(): string {
        return this.uuid;
    }

    public getPassword(): string {
        return this.password;
    }

    public async getProjects(): Promise<Project[]> {
        await this.projects.init();
        return this.projects.getItems();
    }

    public async getTemplates(): Promise<Template[]> {
        await this.templates.init();
        return this.templates.getItems();
    }

    public markAsAdmin(): void {
        this.role = UserRole.ADMIN;
    }
}

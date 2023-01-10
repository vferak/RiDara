import {
    Collection,
    Entity,
    EntityRepositoryType,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Workspace } from '../workspace/workspace.entity';
import { UserWorkspace } from '../userWorkspace/userWorkspace.entity';
import { UserRepository } from './user.repository';

@Entity({ customRepository: () => UserRepository })
export class User {
    [EntityRepositoryType]?: UserRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private email!: string;

    @Property()
    private password!: string;

    @OneToMany('UserWorkspace', 'user')
    private userWorkspaces = new Collection<UserWorkspace>(this);

    private constructor(uuid: string, email: string, password: string) {
        this.uuid = uuid;
        this.email = email;
        this.password = password;
    }

    public static create(createUserDto: CreateUserDto): User {
        const uuid = v4();
        return new User(uuid, createUserDto.email, createUserDto.password);
    }

    public update(updateUserDto: UpdateUserDto): void {
        this.email = updateUserDto.email;
        this.password = updateUserDto.password;
    }
    public getEmail(): string {
        return this.email;
    }

    public getWorkspaces(): Workspace[] {
        const workspaces = [];

        for (const userWorkspace of this.userWorkspaces) {
            workspaces.push(userWorkspace.getWorkspace());
        }

        return workspaces;
    }

    public getPassword(): string {
        return this.password;
    }
    public addUserWorkspace(userWorkspace: UserWorkspace): void {
        this.userWorkspaces.add(userWorkspace);
    }
}

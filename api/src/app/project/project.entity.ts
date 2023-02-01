import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Workspace } from '../workspace/workspace.entity';
import { ProjectRepository } from './project.repository';
import { User } from '../shared/user/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Entity({ customRepository: () => ProjectRepository })
export class Project {
    [EntityRepositoryType]?: ProjectRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private name!: string;

    @Property()
    private path!: string;

    @Property()
    private createDate!: Date;

    @ManyToOne({ entity: () => User, eager: true })
    private owner!: User;

    @ManyToOne({ entity: () => Workspace, eager: true })
    private workspace!: Workspace;

    private constructor(
        uuid: string,
        name: string,
        path: string,
        owner: User,
        workspace: Workspace,
        createDate: Date,
    ) {
        this.uuid = uuid;
        this.name = name;
        this.path = path;
        this.owner = owner;
        this.workspace = workspace;
        this.createDate = createDate;
    }

    public static create(
        createProjectDto: CreateProjectDto,
        user: User,
    ): Project {
        const uuid = v4();
        const date = new Date();
        return new Project(
            uuid,
            createProjectDto.name,
            createProjectDto.path,
            user,
            createProjectDto.workspace,
            date,
        );
    }

    public update(updateProjectDto: UpdateProjectDto): void {
        this.name = updateProjectDto.name;
    }
}

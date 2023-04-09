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
import { Template } from '../template/template.entity';
import { EntityManager } from '@mikro-orm/mariadb';
import { Uuid } from '../common/uuid/uuid';
import { ProjectFileService } from './projectFile/projectFile.service';
import { UuidInterface } from '../common/uuid/uuid.interface';

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

    @ManyToOne({ entity: () => Template, eager: true })
    private template!: Template;

    private constructor(
        uuid: UuidInterface,
        name: string,
        path: string,
        owner: User,
        workspace: Workspace,
        createDate: Date,
        template: Template,
    ) {
        this.uuid = uuid.asString();
        this.name = name;
        this.path = path;
        this.owner = owner;
        this.workspace = workspace;
        this.createDate = createDate;
        this.template = template;
    }

    public static create(
        projectFileService: ProjectFileService,
        createProjectDto: CreateProjectDto,
        user: User,
        template: Template,
        file: Buffer,
    ): Project {
        const uuid = Uuid.createV4();

        const projectFile = projectFileService.writeProjectFile(uuid, file);

        const date = new Date();
        return new Project(
            uuid,
            createProjectDto.name,
            projectFile.getFilePathWithName(),
            user,
            createProjectDto.workspace,
            date,
            template,
        );
    }

    public async remove(entityManager: EntityManager): Promise<void> {
        await entityManager.removeAndFlush(this);
    }

    public update(
        updateProjectDto: UpdateProjectDto,
        workspace: Workspace,
        template: Template,
    ): void {
        this.name = updateProjectDto.name;
        this.template = template;
        this.workspace = workspace;
    }

    public getPath(): string {
        return this.path;
    }

    public getTemplate(): Template {
        return this.template;
    }

    public async getNodesForBpmnDropdown(): Promise<object[]> {
        const templateVersion = await this.getTemplate().getVersionPublished();

        const templateNodes = (await templateVersion.getNodesSortedByName())
            .map((templateNode) => {
                return {
                    uuid: templateNode.getUuid(),
                    name: templateNode.getElementId(),
                }
            });

        const ontologyNodes = (await this.getTemplate().getOntologyFile().getNodesSortedByName())
            .map((ontologyNode) => {
                return {
                    uuid: ontologyNode.getUuid(),
                    name: ontologyNode.getName(),
                }
            });

        return templateNodes.concat(ontologyNodes);
    }
}

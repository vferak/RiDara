import {
    Collection,
    Entity,
    EntityRepositoryType,
    Enum,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Template } from '../template.entity';
import { TemplateNode } from '../templateNode/templateNode.entity';
import { TemplateVersionRepository } from './templateVersion.repository';
import { FileData } from '../../common/file/file.data';
import { UuidInterface } from '../../common/uuid/uuid.interface';
import { Uuid } from '../../common/uuid/uuid';
import { TemplateFileService } from '../templateFile/templateFile.service';
import { TemplateVersionState } from './templateVersionState.enum';
import { OntologyNode } from '../../ontology/ontologyNode/ontologyNode.entity';
import { Project } from '../../project/project.entity';

@Entity({ customRepository: () => TemplateVersionRepository })
export class TemplateVersion {
    [EntityRepositoryType]?: TemplateVersionRepository;

    @PrimaryKey()
    private readonly uuid: string;

    @ManyToOne({ entity: () => Template, eager: true })
    private readonly template!: Template;

    @OneToMany('TemplateNode', 'templateVersion')
    private readonly templateNodes!: Collection<TemplateNode>;

    @OneToMany('Project', 'templateVersion')
    private readonly projects!: Collection<Project>;

    @Property()
    private readonly fileName!: string;

    @Property()
    private readonly createDate!: Date;

    @Enum(() => TemplateVersionState)
    private state!: TemplateVersionState;

    private constructor(
        uuid: string,
        template: Template,
        fileName: string,
        createDate: Date,
        state: TemplateVersionState,
    ) {
        this.templateNodes = new Collection<TemplateNode>(this);

        this.uuid = uuid;
        this.template = template;
        this.fileName = fileName;
        this.createDate = createDate;
        this.state = state;
    }

    public static async createWithUuid(
        uuid: UuidInterface,
        template: Template,
        fileData: FileData,
    ): Promise<TemplateVersion> {
        const now = new Date();

        (await template.getVersionPublished())?.markAsHistory();
        (await template.getVersionDraft())?.markAsPublished();

        return new TemplateVersion(
            uuid.asString(),
            template,
            fileData.getFilePathWithName(),
            now,
            TemplateVersionState.DRAFT,
        );
    }

    public static async create(
        templateFileService: TemplateFileService,
        template: Template,
        file: Buffer,
    ): Promise<TemplateVersion> {
        const uuid = Uuid.createV4();

        const fileData = templateFileService.writeTemplateFile(uuid, file);

        return await TemplateVersion.createWithUuid(uuid, template, fileData);
    }

    public static async duplicate(
        templateFileService: TemplateFileService,
        templateVersion: TemplateVersion,
    ): Promise<TemplateVersion> {
        const newVersionUuid = Uuid.createV4();

        const newFileData = templateFileService.copyTemplateVersionFile(
            templateVersion,
            newVersionUuid,
        );

        return await TemplateVersion.createWithUuid(
            newVersionUuid,
            templateVersion.getTemplate(),
            newFileData,
        );
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getTemplate(): Template {
        return this.template;
    }

    public getFileData(): FileData {
        return FileData.createFromFilePathWithName(this.fileName);
    }

    public getFileName(): string {
        return this.fileName;
    }

    public getState(): TemplateVersionState {
        return this.state;
    }

    public async getNodes(): Promise<TemplateNode[]> {
        return this.templateNodes.loadItems();
    }

    public async getNodesSortedByName(): Promise<TemplateNode[]> {
    return (await this.getNodes())
        .sort((a: TemplateNode, b: TemplateNode): number => {
            const aName = a.getElementId();
            const bName = b.getElementId();

            return aName > bName ? 1 : bName > aName ? -1 : 0;
        })
    }

    public async getOntologyNodes(): Promise<OntologyNode[]> {
        const ontologyNodes = [];
        for (const templateNode of await this.getNodes()) {
            ontologyNodes.push(templateNode.getOntologyNode());
        }
        return ontologyNodes;
    }

    private markAsPublished(): void {
        this.state = TemplateVersionState.PUBLISHED;
    }

    private markAsHistory(): void {
        this.state = TemplateVersionState.HISTORY;
    }
}

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

@Entity({ customRepository: () => TemplateVersionRepository })
export class TemplateVersion {
    [EntityRepositoryType]?: TemplateVersionRepository;

    @PrimaryKey()
    private readonly uuid: string;

    @ManyToOne({ entity: () => Template })
    private readonly template!: Template;

    @OneToMany('TemplateNode', 'templateVersion')
    private readonly templateNodes!: Collection<TemplateNode>;

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

    public static async createWithBlankFile(
        templateFileService: TemplateFileService,
        template: Template,
    ): Promise<TemplateVersion> {
        const uuid = Uuid.createV4();

        const fileData = templateFileService.createBlankTemplateBpmnFile(uuid);

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

    private getTemplate(): Template {
        return this.template;
    }

    public getFileData(): FileData {
        return FileData.createFromFilePathWithName(this.fileName);
    }

    public getState(): TemplateVersionState {
        return this.state;
    }

    public async getNodes(): Promise<TemplateNode[]> {
        await this.templateNodes.init();
        return this.templateNodes.getItems();
    }

    private markAsPublished(): void {
        this.state = TemplateVersionState.PUBLISHED;
    }

    private markAsHistory(): void {
        this.state = TemplateVersionState.HISTORY;
    }
}

import {
    Collection,
    Entity,
    EntityRepositoryType,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { TemplateRepository } from './template.repository';
import { OntologyFile } from '../ontology/ontologyFile/ontologyFile.entity';
import { User } from '../shared/user/user.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateVersion } from './templateVersion/templateVersion.entity';
import { TemplateFileService } from './templateFile/templateFile.service';
import { Uuid } from '../common/uuid/uuid';
import { TemplateVersionState } from './templateVersion/templateVersionState.enum';
import { EditTemplateDto } from './dto/edit-template.dto';

@Entity({ customRepository: () => TemplateRepository })
export class Template {
    [EntityRepositoryType]?: TemplateRepository;

    @PrimaryKey()
    private readonly uuid: string;

    @Property()
    private name!: string;

    @ManyToOne({ entity: () => User })
    private author!: User;

    @Property()
    private createDate!: Date;

    @ManyToOne({ entity: () => OntologyFile, eager: true })
    private readonly ontologyFile!: OntologyFile;

    @OneToMany('TemplateVersion', 'template')
    private templateVersions!: Collection<TemplateVersion>;

    @Property()
    private deleted!: boolean;

    private constructor(
        uuid: string,
        name: string,
        author: User,
        createDate: Date,
        ontologyFile: OntologyFile,
    ) {
        this.templateVersions = new Collection<TemplateVersion>(this);

        this.uuid = uuid;
        this.name = name;
        this.author = author;
        this.createDate = createDate;
        this.ontologyFile = ontologyFile;
        this.deleted = false;
    }

    public static async create(
        templateFileService: TemplateFileService,
        user: User,
        ontologyFile: OntologyFile,
        file: Buffer,
        createTemplateDto: CreateTemplateDto,
    ): Promise<Template> {
        const date = new Date();
        const uuid = Uuid.createV4();

        const template = new Template(
            uuid.asString(),
            createTemplateDto.name,
            user,
            date,
            ontologyFile,
        );

        const publishedVersion = await TemplateVersion.create(
            templateFileService,
            template,
            file,
        );

        await TemplateVersion.duplicate(templateFileService, publishedVersion);

        return template;
    }

    public edit(editTemplateDto: EditTemplateDto): Template {
        this.name = editTemplateDto.name;
        return this;
    }

    public getUuid(): string {
        return this.uuid;
    }

    public async getDraftFileName(): Promise<string> {
        return (await this.getVersionDraft())
            .getFileData()
            .getFilePathWithName();
    }

    public delete(): void {
        this.deleted = true;
    }

    public async getPublishedFileName(): Promise<string> {
        return (await this.getVersionPublished())
            .getFileData()
            .getFilePathWithName();
    }

    public getOntologyFile(): OntologyFile {
        return this.ontologyFile;
    }

    public async getVersionDraft(): Promise<TemplateVersion | undefined> {
        return (await this.templateVersions.loadItems())
            .filter(
                (templateVersion: TemplateVersion) =>
                    templateVersion.getState() === TemplateVersionState.DRAFT,
            )
            .shift();
    }

    public async getVersionPublished(): Promise<TemplateVersion | undefined> {
        return (await this.templateVersions.loadItems())
            .filter(
                (templateVersion: TemplateVersion) =>
                    templateVersion.getState() ===
                    TemplateVersionState.PUBLISHED,
            )
            .shift();
    }

    public async publishDraftVersion(
        templateFileService: TemplateFileService,
    ): Promise<TemplateVersion> {
        const draftVersion = await this.getVersionDraft();
        return await TemplateVersion.duplicate(
            templateFileService,
            draftVersion,
        );
    }
}

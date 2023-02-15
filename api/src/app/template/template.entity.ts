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
import { TemplateRepository } from './template.repository';
import { OntologyFile } from '../ontology/ontologyFile/ontologyFile.entity';
import { User } from '../shared/user/user.entity';
import { CreateTemplateDto } from './dto/create-template.dto';
import { TemplateNode } from './templateNode/templateNode.entity';

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
    private ontologyFile!: OntologyFile;

    @OneToMany('TemplateNode', 'template')
    private templateNodes = new Collection<TemplateNode>(this);

    @Property()
    private readonly fileName!: string;

    private constructor(
        uuid: string,
        name: string,
        author: User,
        createDate: Date,
        ontologyFile: OntologyFile,
        fileName: string,
    ) {
        this.uuid = uuid;
        this.name = name;
        this.author = author;
        this.createDate = createDate;
        this.ontologyFile = ontologyFile;
        this.fileName = fileName;
    }

    public static create(
        user: User,
        ontologyFile: OntologyFile,
        createTemplateDto: CreateTemplateDto,
    ): Template {
        const uuid = v4();
        const date = new Date();
        return new Template(
            uuid,
            createTemplateDto.name,
            user,
            date,
            ontologyFile,
            createTemplateDto.fileName,
        );
    }

    public getFileName(): string {
        return this.fileName;
    }

    public getOntologyFile(): OntologyFile {
        return this.ontologyFile;
    }
}

import {
    Collection,
    Entity,
    EntityRepositoryType,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { OntologyFileRepository } from './ontologyFIle.repository';
import { CreateFileOntologyDto } from '../dto/create-file-ontology.dto';
import { OntologyNode } from '../ontologyNode/ontologyNode.entity';
import { Template } from '../../template/template.entity';

@Entity({ customRepository: () => OntologyFileRepository })
export class OntologyFile {
    [EntityRepositoryType]?: OntologyFileRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private name!: string;

    @Property()
    private createDate!: Date;

    @OneToMany('OntologyNode', 'ontologyFile')
    private ontologyNodes = new Collection<OntologyNode>(this);

    @OneToMany('Template', 'ontologyFile')
    private templates = new Collection<Template>(this);

    private constructor(uuid: string, name: string, createDate: Date) {
        this.uuid = uuid;
        this.name = name;
        this.createDate = createDate;
    }

    public static create(
        createFileOntologyDto: CreateFileOntologyDto,
    ): OntologyFile {
        const uuid = v4();
        const date = new Date();
        return new OntologyFile(uuid, createFileOntologyDto.name, date);
    }

    public async getNodes(): Promise<OntologyNode[]> {
        await this.ontologyNodes.init();
        return this.ontologyNodes.getItems();
    }
}

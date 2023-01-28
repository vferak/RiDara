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

@Entity({ customRepository: () => OntologyFileRepository })
export class OntologyFile {
    [EntityRepositoryType]?: OntologyFileRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private name!: string;

    @Property()
    private createDate!: Date;

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
}

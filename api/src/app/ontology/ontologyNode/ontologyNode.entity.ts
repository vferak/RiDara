import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { OntologyFile } from '../ontologyFile/ontologyFile.entity';
import { OntologyNodeRepository } from './ontologyNode.repository';
import { CreateFileOntologyDto } from '../dto/create-file-ontology.dto';

@Entity({ customRepository: () => OntologyNodeRepository })
export class OntologyNode {
    [EntityRepositoryType]?: OntologyNodeRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private name!: string;

    @ManyToOne({ entity: () => OntologyFile })
    private ontologyFile!: OntologyFile;

    private constructor(
        uuid: string,
        name: string,
        ontologyFile: OntologyFile,
    ) {
        this.uuid = uuid;
        this.name = name;
        this.ontologyFile = ontologyFile;
    }

    public static create(
        createNodeOntologyDto: CreateFileOntologyDto,
    ): OntologyNode {
        const uuid = v4();
        return new OntologyNode(
            uuid,
            createNodeOntologyDto.name,
            createNodeOntologyDto.ontologyFile,
        );
    }

    public getName(): string {
        return this.name;
    }
}

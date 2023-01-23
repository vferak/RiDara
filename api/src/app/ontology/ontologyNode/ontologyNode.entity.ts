import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { CreateNodeOntologyDto } from './dto/create-node-ontology.dto';
import { OntologyFile } from '../ontologyFile/ontologyFile.entity';
import { OntologyNodeRepository } from './ontologyNode.repository';

@Entity({ customRepository: () => OntologyNodeRepository })
export class OntologyNode {
    [EntityRepositoryType]?: OntologyNodeRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private name!: string;


    @ManyToOne({ entity: () => OntologyFile, eager: true })
    private file!: OntologyFile;

    private constructor(uuid: string, name: string) {
        this.uuid = uuid;
        this.name = name;
    }

    public static create(
        createNodeOntologyDto: CreateNodeOntologyDto,
    ): OntologyNode {
        const uuid = v4();
        return new OntologyNode(uuid, createNodeOntologyDto.name);
    }
}

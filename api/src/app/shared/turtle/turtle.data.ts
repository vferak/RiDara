import { CreateNodeOntologyDto } from '../../ontology/dto/create-node-ontology.dto';
import { CreateRelationOntologyDto } from '../../ontology/dto/create-relation-ontology.dto';

export class TurtleData {
    public constructor(
        public readonly createNodeOntologyDtos: CreateNodeOntologyDto[],
        public readonly createRelationOntologyDtos: CreateRelationOntologyDto[],
    ) {}
}

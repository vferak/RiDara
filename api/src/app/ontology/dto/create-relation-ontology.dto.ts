import { OntologyNode } from '../ontologyNode/ontologyNode.entity';

export class CreateRelationOntologyDto {
    public constructor(
        public sourceRef: OntologyNode,
        public targerRef: OntologyNode,
    ) {}
}

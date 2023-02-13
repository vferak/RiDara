import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { OntologyRelationRepository } from './ontologyRelation.repository';
import { CreateRelationOntologyDto } from '../dto/create-relation-ontology.dto';
import { OntologyNode } from '../ontologyNode/ontologyNode.entity';

@Entity({ customRepository: () => OntologyRelationRepository })
export class OntologyRelation {
    [EntityRepositoryType]?: OntologyRelationRepository;

    @PrimaryKey()
    private uuid: string;

    @ManyToOne({ entity: () => OntologyNode })
    private sourceRef!: OntologyNode;

    @ManyToOne({ entity: () => OntologyNode })
    private targetRef!: OntologyNode;

    private constructor(
        uuid: string,
        sourceRef: OntologyNode,
        targetRef: OntologyNode,
    ) {
        this.uuid = uuid;
        this.sourceRef = sourceRef;
        this.targetRef = targetRef;
    }

    public static create(
        createRelationOntologyDto: CreateRelationOntologyDto,
    ): OntologyRelation {
        const uuid = v4();
        return new OntologyRelation(
            uuid,
            createRelationOntologyDto.sourceRef,
            createRelationOntologyDto.targerRef,
        );
    }

    public getSourceRef(): OntologyNode {
        return this.sourceRef;
    }

    public getTargetRef(): OntologyNode {
        return this.targetRef;
    }
}

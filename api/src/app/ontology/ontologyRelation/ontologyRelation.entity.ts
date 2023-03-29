import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
} from '@mikro-orm/core';
import { OntologyRelationRepository } from './ontologyRelation.repository';
import { OntologyNode } from '../ontologyNode/ontologyNode.entity';
import { Uuid } from '../../common/uuid/uuid';
import { UuidInterface } from '../../common/uuid/uuid.interface';

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
        uuid: UuidInterface,
        sourceRef: OntologyNode,
        targetRef: OntologyNode,
    ) {
        this.uuid = uuid.asString();
        this.sourceRef = sourceRef;
        this.targetRef = targetRef;
    }

    public static create(
        sourceRef: OntologyNode,
        targetRef: OntologyNode,
    ): OntologyRelation {
        const uuid = Uuid.createV4();
        return new OntologyRelation(uuid, sourceRef, targetRef);
    }

    public getSourceRef(): OntologyNode {
        return this.sourceRef;
    }

    public getTargetRef(): OntologyNode {
        return this.targetRef;
    }
}

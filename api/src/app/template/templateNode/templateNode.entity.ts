import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { TemplateNodeRepository } from './templateNode.repository';
import { OntologyNode } from '../../ontology/ontologyNode/ontologyNode.entity';
import { TemplateVersion } from '../templateVersion/templateVersion.entity';
import { Uuid } from '../../common/uuid/uuid';
import { UuidInterface } from '../../common/uuid/uuid.interface';

@Entity({ customRepository: () => TemplateNodeRepository })
export class TemplateNode {
    [EntityRepositoryType]?: TemplateNodeRepository;

    @PrimaryKey()
    private uuid: string;

    @ManyToOne({ entity: () => TemplateVersion })
    private templateVersion!: TemplateVersion;

    @ManyToOne({ entity: () => OntologyNode, eager: true })
    private ontologyNode!: OntologyNode;

    @Property()
    private elementId!: string;

    private constructor(
        uuid: UuidInterface,
        templateVersion: TemplateVersion,
        ontologyNode: OntologyNode,
        elementId: string,
    ) {
        this.uuid = uuid.asString();
        this.templateVersion = templateVersion;
        this.ontologyNode = ontologyNode;
        this.elementId = elementId;
    }

    public static create(
        templateVersion: TemplateVersion,
        ontologyNode: OntologyNode,
        elementId: string,
    ): TemplateNode {
        const uuid = Uuid.createV4();
        return new TemplateNode(uuid, templateVersion, ontologyNode, elementId);
    }

    public getUuid(): string {
        return this.uuid;
    }

    public getOntologyNode(): OntologyNode {
        return this.ontologyNode;
    }

    public getElementId(): string {
        return this.elementId;
    }
}

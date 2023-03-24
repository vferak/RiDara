import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { TemplateNodeRepository } from './templateNode.repository';
import { OntologyNode } from '../../ontology/ontologyNode/ontologyNode.entity';
import { TemplateVersion } from '../templateVersion/templateVersion.entity';

@Entity({ customRepository: () => TemplateNodeRepository })
export class TemplateNode {
    [EntityRepositoryType]?: TemplateNodeRepository;

    @PrimaryKey()
    private uuid: string;

    @ManyToOne({ entity: () => TemplateVersion })
    private templateVersion!: TemplateVersion;

    @ManyToOne({ entity: () => OntologyNode })
    private ontologyNode!: OntologyNode;

    private constructor(
        uuid: string,
        templateVersion: TemplateVersion,
        ontologyNode: OntologyNode,
    ) {
        this.uuid = uuid;
        this.templateVersion = templateVersion;
        this.ontologyNode = ontologyNode;
    }

    public static create(
        templateVersion: TemplateVersion,
        ontologyNode: OntologyNode,
    ): TemplateNode {
        const uuid = v4();
        return new TemplateNode(uuid, templateVersion, ontologyNode);
    }

    public getOntologyNode(): OntologyNode {
        return this.ontologyNode;
    }
}

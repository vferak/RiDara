import {
    Entity,
    EntityRepositoryType,
    ManyToOne,
    PrimaryKey,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { TemplateNodeRepository } from './templateNode.repository';
import { Template } from '../template.entity';
import { OntologyNode } from '../../ontology/ontologyNode/ontologyNode.entity';

@Entity({ customRepository: () => TemplateNodeRepository })
export class TemplateNode {
    [EntityRepositoryType]?: TemplateNodeRepository;

    @PrimaryKey()
    private uuid: string;

    @ManyToOne({ entity: () => Template })
    private template!: Template;

    @ManyToOne({ entity: () => OntologyNode })
    private ontologyNode!: OntologyNode;

    private constructor(
        uuid: string,
        template: Template,
        ontologyNode: OntologyNode,
    ) {
        this.uuid = uuid;
        this.template = template;
        this.ontologyNode = ontologyNode;
    }

    public static create(
        template: Template,
        ontologyNode: OntologyNode,
    ): TemplateNode {
        const uuid = v4();
        return new TemplateNode(uuid, template, ontologyNode);
    }
}

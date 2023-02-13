import {
    Collection,
    Entity,
    EntityRepositoryType,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { OntologyFile } from '../ontologyFile/ontologyFile.entity';
import { OntologyNodeRepository } from './ontologyNode.repository';
import { CreateFileOntologyDto } from '../dto/create-file-ontology.dto';
import { TemplateNode } from '../../template/templateNode/templateNode.entity';
import { OntologyRelation } from '../ontologyRelation/ontologyRelation.entity';

@Entity({ customRepository: () => OntologyNodeRepository })
export class OntologyNode {
    [EntityRepositoryType]?: OntologyNodeRepository;

    @PrimaryKey()
    private uuid: string;

    @Property()
    private name!: string;

    @ManyToOne({ entity: () => OntologyFile })
    private ontologyFile!: OntologyFile;

    @OneToMany('TemplateNode', 'ontologyNode')
    private templateNodes = new Collection<TemplateNode>(this);

    @OneToMany('OntologyRelation', 'targetRef')
    private targetRefs = new Collection<OntologyRelation>(this);

    @OneToMany('OntologyRelation', 'sourceRef')
    private sourceRefs = new Collection<OntologyRelation>(this);

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

    public async getSourceRef(): Promise<OntologyRelation[]> {
        await this.sourceRefs.init();
        return this.sourceRefs.getItems();
    }

    public async getTargetRef(): Promise<OntologyRelation[]> {
        await this.targetRefs.init();
        return this.targetRefs.getItems();
    }
}

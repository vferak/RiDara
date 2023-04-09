import {
    Collection,
    Entity,
    EntityRepositoryType,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { OntologyFile } from '../ontologyFile/ontologyFile.entity';
import { OntologyNodeRepository } from './ontologyNode.repository';
import { TemplateNode } from '../../template/templateNode/templateNode.entity';
import { OntologyRelation } from '../ontologyRelation/ontologyRelation.entity';
import { CreateNodeOntologyDto } from '../dto/create-node-ontology.dto';
import { Uuid } from '../../common/uuid/uuid';
import { UuidInterface } from '../../common/uuid/uuid.interface';

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
        uuid: UuidInterface,
        name: string,
        ontologyFile: OntologyFile,
    ) {
        this.uuid = uuid.asString();
        this.name = name;
        this.ontologyFile = ontologyFile;
    }

    public static create(
        ontologyFile: OntologyFile,
        createNodeOntologyDto: CreateNodeOntologyDto,
    ): OntologyNode {
        const uuid = Uuid.createV4();
        return new OntologyNode(uuid, createNodeOntologyDto.name, ontologyFile);
    }

    public getUuid(): string {
        return this.uuid;
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

import { Injectable } from '@nestjs/common';
import { OntologyNodeRepository } from './ontologyNode.repository';
import { OntologyNode } from './ontologyNode.entity';
import { CreateNodeOntologyDto } from './dto/create-node-ontology.dto';


@Injectable()
export class OntologyNodeService {
    public constructor(
        private readonly ontologyNodeRepository: OntologyNodeRepository,
    ) {}

    public async loadFile(
        createNodeOntologyDto: CreateNodeOntologyDto,
    ): Promise<OntologyNode> {
        const ontologyNode = OntologyNode.create(createNodeOntologyDto);
        await this.ontologyNodeRepository.persistAndFlush(ontologyNode);

        return ontologyNode;
    }
}

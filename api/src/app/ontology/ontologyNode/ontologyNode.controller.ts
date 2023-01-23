import { Body, Controller, Post } from '@nestjs/common';
import { CreateNodeOntologyDto } from './dto/create-node-ontology.dto';
import { OntologyNode } from './ontologyNode.entity';
import { OntologyNodeService } from './ontologyNode.service';

@Controller('ontologyNode')
export class OntologyNodeController {
    constructor(private readonly ontologyNodeService: OntologyNodeService) {}

    @Post('addNode')
    public async create(
        @Body() createNodeOntologyDto: CreateNodeOntologyDto,
    ): Promise<OntologyNode> {
        return this.ontologyNodeService.loadFile(createNodeOntologyDto);
    }
}

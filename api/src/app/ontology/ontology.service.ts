import { Injectable } from '@nestjs/common';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import { OntologyFileRepository } from './ontologyFile/ontologyFIle.repository';
import { OntologyNodeRepository } from './ontologyNode/ontologyNode.repository';
import { OntologyFile } from './ontologyFile/ontologyFile.entity';
import { OntologyNode } from './ontologyNode/ontologyNode.entity';
import { BpmnElementData } from '../bpmn/bpmnElement.data';
import { TurtleData } from '../shared/turtle/turtle.data';

@Injectable()
export class OntologyService {
    public constructor(
        private readonly ontologyFileRepository: OntologyFileRepository,
        private readonly ontologyNodeRepository: OntologyNodeRepository,
    ) {}

    public async getOneFileByUuid(uuid: string): Promise<OntologyFile> {
        return this.ontologyFileRepository.findOneOrFail({ uuid: uuid });
    }

    public async getOneNodeByUuid(uuid: string): Promise<OntologyNode> {
        return this.ontologyNodeRepository.findOneOrFail({ uuid: uuid });
    }

    public async findAll(): Promise<OntologyFile[]> {
        return this.ontologyFileRepository.findAll();
    }

    public async getAllNodesByFile(
        ontologyFile: OntologyFile,
    ): Promise<OntologyNode[]> {
        return this.ontologyNodeRepository.find({ ontologyFile: ontologyFile });
    }

    public async createOntologyFile(
        turtleData: TurtleData,
        createFileOntologyDto: CreateFileOntologyDto,
    ): Promise<void> {
        const ontologyFile = OntologyFile.create(
            turtleData,
            createFileOntologyDto,
        );

        await this.ontologyFileRepository.persistAndFlush(ontologyFile);
    }

    public async getNodesByBPMNData(
        bpmnElementData: BpmnElementData[],
    ): Promise<string[]> {
        const elements: string[] = [];
        for (const element of bpmnElementData) {
            if (element.getElementId() === undefined) {
                elements.push(element.getUpmmName());
            } else {
                elements.push(element.getElementId());
            }
        }
        return elements.sort();
    }
}

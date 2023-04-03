import { Injectable } from '@nestjs/common';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import { OntologyFileRepository } from './ontologyFile/ontologyFIle.repository';
import { OntologyNodeRepository } from './ontologyNode/ontologyNode.repository';
import { OntologyFile } from './ontologyFile/ontologyFile.entity';
import { OntologyNode } from './ontologyNode/ontologyNode.entity';
import { BpmnData } from '../bpmn/bpmn.data';
import { OntologyRelationRepository } from './ontologyRelation/ontologyRelation.repository';
import { TurtleData } from '../shared/turtle/turtle.data';

@Injectable()
export class OntologyService {
    public constructor(
        private readonly ontologyFileRepository: OntologyFileRepository,
        private readonly ontologyNodeRepository: OntologyNodeRepository,
        private readonly ontologyRelationRepository: OntologyRelationRepository,
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
        bpmnData: BpmnData,
    ): Promise<Map<string, number>> {
        const data = await Promise.all(
            bpmnData.getElements().map(async (object) => {
                return await this.ontologyNodeRepository.findOneOrFail(
                    object.getUpmmUuid().toString(),
                );
            }),
        );
        const map = data
            .sort((a, b) =>
                a.getName() > b.getName()
                    ? 1
                    : b.getName() > a.getName()
                    ? -1
                    : 0,
            )
            .reduce(
                (acc, e) =>
                    acc.set(e.getName(), (acc.get(e.getName()) || 0) + 1),
                new Map<string, number>(),
            );

        return map;
    }
}

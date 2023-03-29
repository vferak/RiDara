import { Injectable } from '@nestjs/common';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import * as N3 from 'n3/lib';
import { Express } from 'express';
import { OntologyFileRepository } from './ontologyFile/ontologyFIle.repository';
import { OntologyNodeRepository } from './ontologyNode/ontologyNode.repository';
import { OntologyFile } from './ontologyFile/ontologyFile.entity';
import { OntologyNode } from './ontologyNode/ontologyNode.entity';
import { BpmnData } from '../bpmn/bpmn.data';
import { OntologyRelationRepository } from './ontologyRelation/ontologyRelation.repository';
import { CreateRelationOntologyDto } from './dto/create-relation-ontology.dto';
import { OntologyRelation } from './ontologyRelation/ontologyRelation.entity';

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

    public async loadFile(
        file: Express.Multer.File,
        createFileOntologyDto: CreateFileOntologyDto,
    ): Promise<void> {
        const parser = new N3.Parser({ format: 'Turtle' });
        const quads: N3.Quad[] = parser.parse(file.buffer.toString());
        const relations = {};

        const classes = quads
            .filter(
                (quad) =>
                    quad._predicate.id.includes('#type') &&
                    quad._object.id.includes('#Class') &&
                    quad._subject.constructor.name !== 'BlankNode',
            )
            .map(function (quad) {
                return quad._subject.id.toString().split('#')[1];
            });

        const uniqueClasses = [...new Set(classes)];
        const ontologyFile = OntologyFile.create(createFileOntologyDto);
        await this.ontologyFileRepository.persist(ontologyFile);

        const ontologyNodes = new Map<string, OntologyNode>();
        for (const className of uniqueClasses) {
            const createNodeOntologyDto = new CreateFileOntologyDto(
                className,
                ontologyFile,
            );
            const ontologyNode = OntologyNode.create(createNodeOntologyDto);
            await this.ontologyNodeRepository.persist(ontologyNode);
            ontologyNodes.set(ontologyNode.getName(), ontologyNode);
        }

        await this.ontologyFileRepository.flush();

        for (const quad of quads) {
            if (quad._predicate.id.includes('#seeAlso')) {
                const sourceRef = quad._subject.id.toString().split('#')[1];
                const targetRef = quad._object.id.toString().split('#')[1];
                if (
                    uniqueClasses.includes(sourceRef) &&
                    uniqueClasses.includes(targetRef)
                ) {
                    if (relations.hasOwnProperty(sourceRef)) {
                        relations[sourceRef].push(targetRef);
                    } else {
                        relations[sourceRef] = [];
                        relations[sourceRef].push(targetRef);
                    }
                }
            }
        }

        for (const [key, array] of Object.entries(relations)) {
            // @ts-ignore
            for (const value of array) {
                const sourceRef = ontologyNodes.get(key);
                const targetRef = ontologyNodes.get(value);
                const createRelationOntologyDto = new CreateRelationOntologyDto(
                    sourceRef,
                    targetRef,
                );
                const ontologyRelation = OntologyRelation.create(
                    createRelationOntologyDto,
                );

                await this.ontologyRelationRepository.persist(ontologyRelation);
            }
        }
        await this.ontologyRelationRepository.flush();
    }

    public async parseOntologyNodes(
        ontologyNodes: OntologyNode[],
    ): Promise<Map<string, number>> {
        return ontologyNodes
            .map((templateNode) => templateNode.getName())
            .sort()
            .reduce(
                (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
                new Map<string, number>(),
            );
    }

    public async getProjectNodes(
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

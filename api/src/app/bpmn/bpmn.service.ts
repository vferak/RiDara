import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { OntologyNode } from '../ontology/ontologyNode/ontologyNode.entity';
import { OntologyNodeRepository } from '../ontology/ontologyNode/ontologyNode.repository';

@Injectable()
export class BpmnService {
    public constructor(
        private readonly ontologyNodeRepository: OntologyNodeRepository,
    ) {}

    public async parseBpmnFile(pathToBpmn: string): Promise<any> {
        const bpmnFile = fs.readFileSync(pathToBpmn, 'utf8');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const moddle = require('bpmn-moddle')({
            upmm: {
                name: 'UPMM',
                prefix: 'upmm',
                uri: 'http://upmm',
                xml: {
                    tagAlias: 'lowerCase',
                },
                associations: [],
                types: [
                    {
                        name: 'UpmmElement',
                        extends: ['bpmn:BaseElement'],
                        properties: [
                            {
                                name: 'upmmId',
                                isAttr: true,
                                type: 'String',
                            },
                        ],
                    },
                ],
            },
        });

        const {
            rootElement: rootElement,
            elementsById: elementsById,
            references: references,
        } = await moddle.fromXML(bpmnFile);

        const objects = rootElement.get('rootElements')[0].flowElements;

        let classes = [];

        for (const obj of objects) {
            if (obj.upmmId !== undefined) {
                const node = await this.ontologyNodeRepository.findOneOrFail(
                    obj.upmmId.toString(),
                );
                classes.push(node.getName());
            }
        }

        let nodesTotal = 0;
        classes = classes.sort();

        const map = classes.reduce(
            (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
            new Map(),
        );

        for (const [key, value] of map) {
            nodesTotal = nodesTotal + value;
        }

        return [map, nodesTotal];
    }

    public async parseOntologyNodes(
        ontologyNodes: OntologyNode[],
    ): Promise<any> {
        let names = [];
        ontologyNodes = ontologyNodes.filter(
            (templateNode) =>
                templateNode.getName() === 'Entity' ||
                templateNode.getName() === 'Problem',
        );

        for (const obj of ontologyNodes) {
            names.push(obj.getName());
        }

        names = names.sort();
        return names.reduce(
            (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
            new Map(),
        );
    }
}

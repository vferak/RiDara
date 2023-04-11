import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { BpmnData } from './bpmn.data';
import { BpmnElementData } from './bpmnElement.data';

@Injectable()
export class BpmnService {
    private createModdle() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        return require('bpmn-moddle')({
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
                            {
                                "name": "upmmName",
                                "isAttr": true,
                                "type": "String"
                            },
                            {
                                "name": "elementId",
                                "isAttr": true,
                                "type": "String"
                            }
                        ],
                    },
                ],
            },
        });
    }

    public async parseBpmnFile(pathToBpmn: string): Promise<BpmnData> {
        const moddle = this.createModdle();

        const bpmnFile = fs.readFileSync(pathToBpmn, 'utf8');

        const {
            rootElement: rootElement,
            elementsById: elementsById,
            references: references,
        } = await moddle.fromXML(bpmnFile);

        const objects = rootElement.get('rootElements')[0].flowElements;
        const bpmnElementsData = this.createBpmnElementDataFromBaseObjects(
            objects,
            references,
        );
        return new BpmnData(bpmnElementsData);
    }

    private createBpmnElementDataFromBaseObjects(
        objects: any,
        references: any[],
    ): BpmnElementData[] {
        const bpmnElements = [];
        for (const object of objects) {
            if (
                object === undefined ||
                object.upmmId === undefined ||
                object.upmmId === ''
            ) {
                continue;
            }

            const relationsOfObject = references.filter(
                (reference) => reference.element.id === object.id,
            );
            const outgoing: string[] = [];
            const incoming: string[] = [];

            for (const relation of relationsOfObject) {
                const propertyValue = relation.property.split(':')[1];
                if (propertyValue === 'incoming') {
                    const incom = references.filter(
                        (reference) =>
                            reference.id === relation.id &&
                            relation.element.upmm === reference.element.upmm &&
                            reference.property.split(':')[1] === 'outgoing',
                    );

                    incoming.push(incom[0].element.upmmId);
                }
                if (propertyValue === 'outgoing') {
                    const outcom = references.filter(
                        (reference) =>
                            reference.id === relation.id &&
                            relation.element.upmm === reference.element.upmm &&
                            reference.property.split(':')[1] === 'incoming',
                    );

                    outgoing.push(outcom[0].element.upmmId);
                }
            }

            const bpmnData = new BpmnElementData(
                object.$type,
                object.id,
                object.upmmId,
                outgoing,
                incoming,
                object.upmmName,
                object.elementId,
            );

            if (object.hasOwnProperty('flowElements')) {
                bpmnData.setChildElements(
                    this.createBpmnElementDataFromBaseObjects(
                        object.flowElements,
                        references,
                    ),
                );
            }

            bpmnElements.push(bpmnData);
        }

        return bpmnElements;
    }
}

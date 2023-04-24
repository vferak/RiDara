import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { BpmnData } from './bpmn.data';
import { BpmnElementData } from './bpmnElement.data';
import { TemplateVersion } from '../template/templateVersion/templateVersion.entity';
import { TemplateNode } from '../template/templateNode/templateNode.entity';

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
                                name: 'upmmName',
                                isAttr: true,
                                type: 'String',
                            },
                            {
                                name: 'elementId',
                                isAttr: true,
                                type: 'String',
                            },
                        ],
                    },
                ],
            },
        });
    }

    public async parseBpmnFile(
        pathToBpmn: string,
        analyzeTemplate = false,
        fourthLevel = false,
    ): Promise<BpmnData[]> {
        const moddle = this.createModdle();

        const bpmnFile = fs.readFileSync(pathToBpmn, 'utf8');

        const {
            rootElement: rootElement,
            elementsById: elementsById,
            references: references,
        } = await moddle.fromXML(bpmnFile);
        const objects = [];
        for (const object of rootElement.get('rootElements')) {
            const type = object.$type.toString().split(':')[1];
            if (type === 'Process' && object.flowElements !== undefined) {
                objects.push(object);
            }
        }

        const bpmnDatas: BpmnData[] = [];
        if (objects.length === 1) {
            if (objects[0].get('flowElements') === undefined) {
                return [new BpmnData([])];
            }
        }

        for (const object of objects) {
            const bpmnElementsData = this.createBpmnElementDataFromBaseObjects(
                object.flowElements,
                references,
                '',
                analyzeTemplate,
                fourthLevel,
            );
            const bpmnData = new BpmnData(bpmnElementsData);
            bpmnDatas.push(bpmnData);
        }

        if (analyzeTemplate) {
            const duplicities = this.checkElementIdUnique(bpmnDatas);
            if (duplicities.length > 0) {
                const datas: any[] = [];
                const bpmnElementData: BpmnElementData = new BpmnElementData(
                    'notValid',
                    'notValid',
                    '/12/12/12',
                    duplicities,
                );
                datas.push(bpmnElementData);
                return [new BpmnData(datas)];
            }
        }

        return bpmnDatas;
    }

    private createBpmnElementDataFromBaseObjects(
        objects: any,
        references: any[],
        parentProcessId?: string,
        analyzeTemplate?: boolean,
        fourthLevel?: boolean,
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
                    const incom = references.find(
                        (reference) =>
                            reference.id === relation.id &&
                            relation.element.upmm === reference.element.upmm &&
                            reference.property.split(':')[1] === 'outgoing',
                    );

                    if (analyzeTemplate) {
                        incoming.push(incom.element.upmmId);
                    } else {
                        if (fourthLevel) {
                            incoming.push(incom.element.id);
                        } else {
                            if (incom.element.elementId === undefined) {
                                incoming.push(incom.element.upmmName);
                            } else {
                                incoming.push(incom.element.elementId);
                            }
                        }
                    }
                }
                if (propertyValue === 'outgoing') {
                    const outcom = references.find(
                        (reference) =>
                            reference.id === relation.id &&
                            relation.element.upmm === reference.element.upmm &&
                            reference.property.split(':')[1] === 'incoming',
                    );
                    if (analyzeTemplate) {
                        outgoing.push(outcom.element.upmmId);
                    } else {
                        if (fourthLevel) {
                            outgoing.push(outcom.element.id);
                        } else {
                            if (outcom.element.elementId === undefined) {
                                outgoing.push(outcom.element.upmmName);
                            } else {
                                outgoing.push(outcom.element.elementId);
                            }
                        }
                    }
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

            if (parentProcessId !== undefined) {
                bpmnData.setParentId(parentProcessId);
            }

            if (object.hasOwnProperty('flowElements')) {
                const childElements = this.createBpmnElementDataFromBaseObjects(
                    object.flowElements,
                    references,
                    object.id,
                    analyzeTemplate,
                );
                bpmnData.setChildElements(childElements);

                for (const childElement of childElements) {
                    if (childElement.getUpmmUuid() === undefined) {
                        continue;
                    }
                    bpmnElements.push(childElement);
                }
            }

            bpmnElements.push(bpmnData);
        }

        return bpmnElements;
    }

    public async reverseParseBpmnFile(
        pathToBpmn: string,
        templateVersion: TemplateVersion,
    ): Promise<string> {
        const moddle = this.createModdle();
        const bpmnFile = fs.readFileSync(pathToBpmn, 'utf8');

        const {
            rootElement: rootElement,
            elementsById: elementsById,
            references: references,
        } = await moddle.fromXML(bpmnFile);
        const allNodes = await templateVersion.getNodes();
        for (const object of rootElement.get('rootElements')) {
            if (object.hasOwnProperty('flowElements')) {
                this.changeAttributesValues(
                    object.get('flowElements'),
                    allNodes,
                );
            }
        }
        const { xml: xmlStrUpdated } = await moddle.toXML(rootElement);

        return xmlStrUpdated;
    }

    private changeAttributesValues(
        objects: any,
        allNodes: TemplateNode[],
    ): void {
        for (const element of objects) {
            if (!element.hasOwnProperty('upmmId')) {
                continue;
            }
            const searchedTemplateNode = allNodes.find((templateNode) => {
                return templateNode.getElementId() === element.get('elementId');
            });
            element.set('upmmId', searchedTemplateNode.getUuid());
            element.set('upmmName', element.get('elementId'));
            element.set('elementId', undefined);

            if (element.hasOwnProperty('flowElements')) {
                this.changeAttributesValues(
                    element.get('flowElements'),
                    allNodes,
                );
            }
        }
    }

    private checkElementIdUnique(templateData: BpmnData[]): any[] {
        const allBpmnTemplateElementData: BpmnElementData[] =
            templateData.flatMap((obj) => obj.getElements());

        const allElementId: string[] = allBpmnTemplateElementData.flatMap(
            (obj) => obj.getElementId(),
        );

        const uniqueValues = new Set(allElementId);
        if (uniqueValues.size === allElementId.length) {
            return [];
        } else {
            const duplicates: any[] = [];
            allElementId.forEach((value, index) => {
                if (
                    allElementId.indexOf(value) !== index &&
                    !duplicates.includes(value)
                ) {
                    duplicates.push(value);
                }
            });
            return duplicates;
        }
    }
}

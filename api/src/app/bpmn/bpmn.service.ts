import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { BpmnData } from './bpmn.data';
import { BpmnElementData } from './bpmnElement.data';
import { TemplateVersion } from '../template/templateVersion/templateVersion.entity';
import { TemplateNode } from '../template/templateNode/templateNode.entity';
import { Template } from '../template/template.entity';
import { OntologyNode } from '../ontology/ontologyNode/ontologyNode.entity';

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
        const messageFlows: any[] = [];
        for (const object of rootElement.get('rootElements')) {
            const type = object.$type.toString().split(':')[1];
            if (type === 'Process' && object.flowElements !== undefined) {
                objects.push(object);
            } else {
                if (object.hasOwnProperty('messageFlows')) {
                    for (const flow of object.messageFlows) {
                        const relationsOfObject = references.filter(
                            (reference) => reference.element.id === flow.id,
                        );
                        messageFlows.push(relationsOfObject);
                    }
                }
            }
        }

        const bpmnDatas: BpmnData[] = [];
        if (objects.length === 1) {
            if (objects[0].get('flowElements') === undefined) {
                return [new BpmnData([])];
            }
        }
        let allObjects: any[] = [];
        for (const object of objects) {
            const result = this.getAllObjectsToOneLevel(object.flowElements);
            allObjects = [...allObjects, ...result];
        }

        let bpmnElementsData;
        for (const object of objects) {
            bpmnElementsData = this.createBpmnElementDataFromBaseObjects(
                messageFlows,
                object.flowElements,
                references,
                '',
                analyzeTemplate,
                fourthLevel,
            );
            const bpmnData = new BpmnData(bpmnElementsData);
            bpmnDatas.push(bpmnData);
        }
        //temporary condition
        /*if (fourthLevel) {
            const allBpmnTemplateElementData: BpmnElementData[] =
                bpmnDatas.flatMap((obj) => obj.getElements());
            const res = this.assignMessagesFlows(
                messageFlows,
                references,
                allObjects,
                allBpmnTemplateElementData,
                analyzeTemplate,
                fourthLevel,
            );
        }*/

        //const newBpmnData = new BpmnData(res);

        let result;
        const finalResult: BpmnData[] = [];
        for (const bpmnData of bpmnDatas) {
            result = this.changeRelationsValues(
                allObjects,
                bpmnData.getElements(),
                analyzeTemplate,
                fourthLevel,
            );

            const newBpmnData = new BpmnData(result);
            finalResult.push(newBpmnData);
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
        return finalResult;

        //return bpmnDatas;
    }

    private createBpmnElementDataFromBaseObjects(
        messageFlows: any[],
        objects: any,
        references: any[],
        parentProcessId?: string,
        analyzeTemplate?: boolean,
        fourthLevel?: boolean,
    ): BpmnElementData[] {
        const bpmnElements: BpmnElementData[] = [];
        for (const object of objects) {
            if (
                object === undefined ||
                object.upmmId === undefined ||
                object.upmmId === ''
            ) {
                continue;
            }

            /* if (
                object.$type.toString().split(':')[1] === 'DataObjectReference'
            ) {

                const relationsOfObject = references.filter(
                    (reference) => reference.element.id === object.id,
                );
            }*/

            const relationsOfObject = references.filter(
                (reference) => reference.element.id === object.id,
            );

            let outgoing: string[] = [];
            let incoming: string[] = [];

            for (const relation of relationsOfObject) {
                const propertyValue = relation.property.split(':')[1];

                if (relation.element.hasOwnProperty('dataInputAssociations')) {
                    const dataInputAssociations =
                        relation.element.dataInputAssociations;
                    for (const dataOutputAssociation of dataInputAssociations) {
                        const incominAssociation = references.find(
                            (reference) =>
                                reference.element.id ===
                                dataOutputAssociation.id,
                        );
                        const objectOfIncomingAssociation = objects.find(
                            (object) => object.id === incominAssociation.id,
                        );

                        incoming.push(objectOfIncomingAssociation.id);

                        /*if (analyzeTemplate) {
                            incoming.push(objectOfIncomingAssociation.upmmId);
                        } else {
                            if (fourthLevel) {
                                incoming.push(objectOfIncomingAssociation.id);
                            } else {
                                if (
                                    objectOfIncomingAssociation.elementId ===
                                    undefined
                                ) {
                                    incoming.push(
                                        objectOfIncomingAssociation.upmmName,
                                    );
                                } else {
                                    incoming.push(
                                        objectOfIncomingAssociation.elementId,
                                    );
                                }
                            }
                        }*/
                    }
                    incoming = [...new Set(incoming)];
                }

                if (relation.element.hasOwnProperty('dataOutputAssociations')) {
                    const dataOutputAssociations =
                        relation.element.dataOutputAssociations;
                    for (const dataOutputAssociation of dataOutputAssociations) {
                        const outgoingAssociation = references.find(
                            (reference) =>
                                reference.element.id ===
                                dataOutputAssociation.id,
                        );
                        const objectOfOutgoingAssociation = objects.find(
                            (object) => object.id === outgoingAssociation.id,
                        );

                        /*if (analyzeTemplate) {
                            outgoing.push(objectOfOutgoingAssociation.upmmId);
                        } else {
                            if (fourthLevel) {
                                outgoing.push(objectOfOutgoingAssociation.id);
                            } else {
                                if (
                                    objectOfOutgoingAssociation.elementId ===
                                    undefined
                                ) {
                                    outgoing.push(
                                        objectOfOutgoingAssociation.upmmName,
                                    );
                                } else {
                                    outgoing.push(
                                        objectOfOutgoingAssociation.elementId,
                                    );
                                }
                            }
                        }*/
                        outgoing.push(objectOfOutgoingAssociation.id);
                    }
                    outgoing = [...new Set(outgoing)];
                }

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

            const bpmnElementData = new BpmnElementData(
                object.$type,
                object.id,
                object.upmmId,
                outgoing,
                incoming,
                object.upmmName,
                object.elementId,
            );

            if (parentProcessId !== undefined) {
                bpmnElementData.setParentId(parentProcessId);
            }

            if (object.hasOwnProperty('flowElements')) {
                const childElements = this.createBpmnElementDataFromBaseObjects(
                    messageFlows,
                    object.flowElements,
                    references,
                    object.id,
                    analyzeTemplate,
                );
                bpmnElementData.setChildElements(childElements);

                for (const childElement of childElements) {
                    if (childElement.getUpmmUuid() === undefined) {
                        continue;
                    }
                    bpmnElements.push(childElement);
                }
            }

            bpmnElements.push(bpmnElementData);
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
        //TODO dodelat asociace
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

            if (searchedTemplateNode !== undefined) {
                element.set('upmmId', searchedTemplateNode.getUuid());
                element.set('upmmName', element.get('elementId'));
                element.set('elementId', undefined);
            }

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

    private changeRelationsValues(
        objects: any[],
        allBpmnElementData: BpmnElementData[],
        analyzeTemplate?: boolean,
        fourthLevel?: boolean,
    ): BpmnElementData[] {
        for (const bpmnElement of allBpmnElementData) {
            const outgoingOfElement = bpmnElement.getOutgoing();
            const incomingOfElement = bpmnElement.getIncoming();

            const searchedOutgoingElements = objects.filter((object) =>
                outgoingOfElement.includes(object.id),
            );

            const searchedIncomingElements = objects.filter((object) =>
                incomingOfElement.includes(object.id),
            );

            let newOutgoingForUpperBpmnElement = bpmnElement.getOutgoing();
            let newIncomingForUpperBpmnElement = bpmnElement.getIncoming();

            for (const searchedOutgoingElement of searchedOutgoingElements) {
                const bpmnElementDataToEdit = allBpmnElementData.find(
                    (bpmnElement) =>
                        bpmnElement.getId() === searchedOutgoingElement.id,
                );

                newOutgoingForUpperBpmnElement =
                    newOutgoingForUpperBpmnElement.filter(
                        (value) => value !== searchedOutgoingElement.id,
                    );

                const incomingToChange = bpmnElementDataToEdit.getIncoming();

                if (analyzeTemplate) {
                    incomingToChange.push(bpmnElement.getUpmmUuid());
                    newOutgoingForUpperBpmnElement.push(
                        bpmnElementDataToEdit.getUpmmUuid(),
                    );
                } else {
                    if (fourthLevel) {
                        incomingToChange.push(bpmnElement.getId());
                        newOutgoingForUpperBpmnElement.push(
                            bpmnElementDataToEdit.getId(),
                        );
                    } else {
                        if (bpmnElement.getElementId() === undefined) {
                            incomingToChange.push(bpmnElement.getUpmmName());
                            newOutgoingForUpperBpmnElement.push(
                                bpmnElementDataToEdit.getUpmmName(),
                            );
                        } else {
                            incomingToChange.push(bpmnElement.getElementId());
                            newOutgoingForUpperBpmnElement.push(
                                bpmnElementDataToEdit.getElementId(),
                            );
                        }
                    }
                }
                bpmnElementDataToEdit.setIncoming(incomingToChange);
                bpmnElement.setOutgoing(newOutgoingForUpperBpmnElement);
            }
            /////////////SECOND PART
            for (const searchedIngoingElement of searchedIncomingElements) {
                const bpmnElementDataToEdit = allBpmnElementData.find(
                    (bpmnElement) =>
                        bpmnElement.getId() === searchedIngoingElement.id,
                );
                newIncomingForUpperBpmnElement =
                    newIncomingForUpperBpmnElement.filter(
                        (value) => value !== searchedIngoingElement.id,
                    );

                const outGoingToChange = bpmnElementDataToEdit.getOutgoing();

                if (analyzeTemplate) {
                    outGoingToChange.push(bpmnElement.getUpmmUuid());
                    newIncomingForUpperBpmnElement.push(
                        bpmnElementDataToEdit.getUpmmUuid(),
                    );
                } else {
                    if (fourthLevel) {
                        outGoingToChange.push(bpmnElement.getId());
                        newIncomingForUpperBpmnElement.push(
                            bpmnElementDataToEdit.getId(),
                        );
                    } else {
                        if (bpmnElement.getElementId() === undefined) {
                            outGoingToChange.push(bpmnElement.getUpmmName());
                            newIncomingForUpperBpmnElement.push(
                                bpmnElementDataToEdit.getUpmmName(),
                            );
                        } else {
                            outGoingToChange.push(bpmnElement.getElementId());
                            newIncomingForUpperBpmnElement.push(
                                bpmnElementDataToEdit.getElementId(),
                            );
                        }
                    }
                }

                bpmnElementDataToEdit.setOutgoing(outGoingToChange);
                bpmnElement.setIncoming(newIncomingForUpperBpmnElement);
            }
        }

        return allBpmnElementData;
    }

    private assignMessagesFlows(
        messageFlows: any[],
        references: any[],
        objects: any[],
        allBpmnElementData: BpmnElementData[],
        analyzeTemplate?: boolean,
        fourthLevel?: boolean,
    ): BpmnElementData[] {
        /*const a = allBpmnElementData.find(
            (bpmnElement) => bpmnElement.getId() === 'Activity_0xla8a9',
        );*/
        for (const messageFlow of messageFlows) {
            let fromElement: BpmnElementData;
            let toElement: BpmnElementData;
            //temporary
            if (fourthLevel) {
                for (const flow of messageFlow) {
                    const property = flow.property.toString().split(':')[1];
                    if (property === 'sourceRef') {
                        fromElement = allBpmnElementData.find(
                            (bpmnElement) => bpmnElement.getId() === flow.id,
                        );
                    }

                    if (property === 'targetRef') {
                        toElement = allBpmnElementData.find(
                            (bpmnElement) => bpmnElement.getId() === flow.id,
                        );
                    }

                    /* if (fromElement !== undefined && toElement !== undefined) {
                        console.log('before');

                        console.log(fromElement);
                        console.log(toElement);
                        let fromOutgoin = fromElement.getOutgoing();
                        console.log(fromOutgoin);

                        fromOutgoin.push(toElement.getId());
                        fromElement.setOutgoing(fromOutgoin);

                        let toIncoming = toElement.getIncoming();
                        console.log(toIncoming);
                        toIncoming.push(fromElement.getId());
                        fromElement.setIncoming(toIncoming);

                        console.log('after');
                        console.log(fromOutgoin);
                        console.log(toIncoming);

                        console.log(fromElement);
                        console.log(toElement);
                        fromOutgoin = [];
                        toIncoming = [];

                        fromElement = undefined;
                        toElement = undefined;
                    }*/
                }
            }
        }
        const first = allBpmnElementData.find(
            (bpmnElement) => bpmnElement.getId() === 'Activity_0c4uib2',
        );

        const subprocess = allBpmnElementData.find(
            (bpmnElement) => bpmnElement.getId() === 'Activity_0xla8a9',
        );

        const second = allBpmnElementData.find(
            (bpmnElement) => bpmnElement.getId() === 'Activity_1veryrs',
        );
        console.log(first);
        console.log(second);
        console.log(subprocess);

        return allBpmnElementData;
    }

    private getAllObjectsToOneLevel(objects: any[]): any[] {
        const result = [];
        for (const object of objects) {
            result.push(object);
            if (object.hasOwnProperty('flowElements')) {
                const childElements = this.getAllObjectsToOneLevel(
                    object.flowElements,
                );

                for (const childElement of childElements) {
                    if (childElement.upmmId === undefined) {
                        continue;
                    }
                    result.push(childElement);
                }
            }
        }
        return result;
    }

    public async changeStructureOfImportedFile(
        file: Buffer,
        allNodesByTemplate: OntologyNode[],
        allTemplateNodes: TemplateNode[],
        importTemplate?: boolean,
    ): Promise<Buffer> {
        const moddle = this.createModdle();
        const bpmnFile = file.toString();

        const {
            rootElement: rootElement,
            elementsById: elementsById,
            references: references,
        } = await moddle.fromXML(bpmnFile);

        const objects = [];
        const messageFlows: any[] = [];
        for (const object of rootElement.get('rootElements')) {
            const type = object.$type.toString().split(':')[1];
            if (type === 'Process' && object.flowElements !== undefined) {
                objects.push(object);
            } else {
                if (object.hasOwnProperty('messageFlows')) {
                    for (const flow of object.messageFlows) {
                        const relationsOfObject = references.filter(
                            (reference) => reference.element.id === flow.id,
                        );
                        messageFlows.push(relationsOfObject);
                    }
                }
            }
        }

        for (const object of objects) {
            if (importTemplate) {
                // import template
                this.changeImportedAttributesValues(
                    object.get('flowElements'),
                    allNodesByTemplate,
                    true,
                );
            } else {
                // import project
                this.changeImportedAttributesValues(
                    object.get('flowElements'),
                    allTemplateNodes,
                    false,
                );
            }
        }
        const { xml: xmlStrUpdated } = await moddle.toXML(rootElement);
        return Buffer.from(xmlStrUpdated);
    }

    private changeImportedAttributesValues(
        objects: any,
        databaseNodes: any[],
        importTemplate?: boolean,
    ): void {
        for (const element of objects) {
            if (importTemplate) {
                const searchedNode = databaseNodes.find((node) => {
                    return node.getName() === element.get('upmmName');
                });

                if (searchedNode !== undefined) {
                    element.set('upmmId', searchedNode.getUuid());
                }

                if (element.hasOwnProperty('flowElements')) {
                    this.changeImportedAttributesValues(
                        element.get('flowElements'),
                        databaseNodes,
                        importTemplate,
                    );
                }
            } else {
                const searchedTemplateNode = databaseNodes.find(
                    (templateNode) => {
                        return (
                            templateNode.getElementId() ===
                            element.get('upmmName')
                        );
                    },
                );

                if (searchedTemplateNode !== undefined) {
                    element.set('upmmId', searchedTemplateNode.getUuid());
                }
                if (element.hasOwnProperty('flowElements')) {
                    this.changeImportedAttributesValues(
                        element.get('flowElements'),
                        databaseNodes,
                        importTemplate,
                    );
                }
            }
        }
    }
}

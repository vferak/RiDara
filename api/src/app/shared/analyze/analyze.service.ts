import { Injectable } from '@nestjs/common';
import { BpmnElementData } from '../../bpmn/bpmnElement.data';
import { AnalyzeData } from './analyze.data';
import { OntologyService } from '../../ontology/ontology.service';
import { RelationErrorData } from './relationError.data';

@Injectable()
export class AnalyzeService {
    constructor(private readonly ontologyService: OntologyService) {}

    public async firstLevelAnalyze(
        projectNodesMap: Map<string, number>,
        templatesNodesMap: Map<string, number>,
    ): Promise<AnalyzeData> {
        let successfullNodes = 0;
        let badNodes = 0;
        const percentArray = [];

        const fullSuccess = templatesNodesMap.size;
        let areEqual: boolean;
        if (templatesNodesMap.size === projectNodesMap.size) {
            areEqual = [...templatesNodesMap.entries()].every(
                ([key, value], index) => {
                    return (
                        [key, value].toString() ===
                        [...projectNodesMap.entries()][index].toString()
                    );
                },
            );
        } else {
            areEqual = false;
        }

        if (areEqual) {
            percentArray.push(100);

            const analyzeData = new AnalyzeData(
                percentArray,
                new Map(),
                new Map(),
                new Map(),
            );

            return analyzeData;
        }

        const missing = new Map();
        const overExtends = new Map();
        const notRecognized = new Map();
        projectNodesMap.forEach((value, key) => {
            if (!templatesNodesMap.has(key)) {
                notRecognized.set(key, value);
                badNodes += 1;
            } else {
                if (!(templatesNodesMap.get(key) === value)) {
                    if (value > templatesNodesMap.get(key)) {
                        overExtends.set(
                            key,
                            value - templatesNodesMap.get(key),
                        );
                    } else {
                        notRecognized.set(
                            key,
                            value - templatesNodesMap.get(key),
                        );
                    }
                    badNodes += 1;
                }
            }
            if (
                templatesNodesMap.has(key) &&
                templatesNodesMap.get(key) === value
            ) {
                successfullNodes += 1;
            }
        });

        templatesNodesMap.forEach((value, key) => {
            if (!projectNodesMap.has(key)) {
                missing.set(key, value);
            } else {
                if (!(projectNodesMap.get(key) === value)) {
                    if (value > projectNodesMap.get(key)) {
                        missing.set(key, value);
                    }
                }
            }
        });

        const percentMatch = (successfullNodes / fullSuccess) * 100;
        percentArray.push(percentMatch);

        const analyzeData = new AnalyzeData(
            percentArray,
            missing,
            notRecognized,
            overExtends,
        );

        return analyzeData;
    }
    public async secondLevelAnalyze(
        projectNodes: BpmnElementData[],
        templatesNodes: BpmnElementData[],
        analyzedData: AnalyzeData,
    ): Promise<any> {
        const rightNodes = [];
        const missingNodes = [];
        for (const templateElement of templatesNodes) {
            for (const projectElement of projectNodes) {
                if (
                    projectElement.getUpmmUuid() ===
                        templateElement.getUpmmUuid() &&
                    projectElement.getType() === templateElement.getType()
                ) {
                    rightNodes.push(projectElement);
                }
            }
        }

        const errorsObjects = projectNodes.filter(
            (elem) => !rightNodes.find(({ id }) => elem.getId() === id),
        );

        const errorMap = new Map<string, string>();
        if (errorsObjects.length === 0) {
            const percents = analyzedData.getPercentArray();
            percents.push(100);

            analyzedData.setPercentArray(percents);
            analyzedData.setShapeMap(errorMap);
            return analyzedData;
        }

        for (const errorObj of errorsObjects) {
            for (const templateNode of templatesNodes) {
                if (errorObj.getUpmmUuid() === templateNode.getUpmmUuid()) {
                    errorMap.set(
                        errorObj.getId(),
                        templateNode.getType().split(':')[1],
                    );
                }
            }
        }

        const percent = (1 - errorMap.size / templatesNodes.length) * 100;
        const percents = analyzedData.getPercentArray();
        percents.push(percent);
        analyzedData.setPercentArray(percents);
        analyzedData.setShapeMap(errorMap);

        return analyzedData;
    }

    public async thirdLevelAnalyze(
        projectNodes: BpmnElementData[],
        templatesNodes: BpmnElementData[],
        analyzedData: AnalyzeData,
    ): Promise<any> {
        const relationErrorsData: RelationErrorData[] = [];

        for (const templateElement of templatesNodes) {
            for (const projectElement of projectNodes) {
                if (
                    projectElement.getUpmmUuid() ===
                    templateElement.getUpmmUuid()
                ) {
                    const projectIncoming = projectElement.getIncoming().sort();
                    const templateIncoming = templateElement
                        .getIncoming()
                        .sort();

                    const projectOutgoing = projectElement.getOutgoing().sort();
                    const templateOutgoing = templateElement
                        .getOutgoing()
                        .sort();

                    let isEqualIncoming;
                    let isEqualOutgoing;
                    if (
                        templateIncoming.length === 0 &&
                        projectIncoming.length === 0
                    ) {
                        isEqualIncoming = true;
                    } else {
                        isEqualIncoming =
                            projectIncoming.length ===
                                templateIncoming.length &&
                            templateIncoming.length !== 0 &&
                            projectIncoming.every((val) =>
                                templateIncoming.includes(val),
                            );
                    }

                    if (
                        templateOutgoing.length === 0 &&
                        projectOutgoing.length === 0
                    ) {
                        isEqualOutgoing = true;
                    } else {
                        isEqualOutgoing =
                            projectOutgoing.length ===
                                templateOutgoing.length &&
                            templateOutgoing.length !== 0 &&
                            projectOutgoing.every((val) =>
                                templateOutgoing.includes(val),
                            );
                    }

                    if (!isEqualIncoming) {
                        const data = await this.checkIncomingRelations(
                            projectIncoming,
                            templateIncoming,
                            projectNodes,
                            projectElement,
                            templateElement,
                        );
                        relationErrorsData.push(data);
                    }

                    if (!isEqualOutgoing) {
                        const data = await this.checkOutgoingRelations(
                            projectOutgoing,
                            templateOutgoing,
                            projectNodes,
                            projectElement,
                            templateElement,
                        );
                        relationErrorsData.push(data);
                    }
                }
            }
        }

        const finalrelationErrorsData = [];
        const duplicatesMap = relationErrorsData.reduce((acc, item) => {
            if (!acc.has(item.getUpmmId())) {
                acc.set(item.getUpmmId(), [item]);
            } else {
                acc.get(item.getUpmmId()).push(item);
            }
            return acc;
        }, new Map());

        const duplicatesArray = Array.from(duplicatesMap.values());

        const filteredDuplicities = duplicatesArray.filter(
            (subarray) => subarray.length > 1,
        );

        const uniqueRelationErrorsData = relationErrorsData.filter(
            (obj, index, arr) => {
                const isUnique = Object.keys(obj).every((key) => {
                    const count = arr.filter((o) => o[key] === obj[key]).length;
                    return count === 1;
                });
                return isUnique;
            },
        );

        for (const object of filteredDuplicities) {
            let mergedErrorArray: string[] = [];
            let upmmId = '';
            let id = '';
            let mergedMissingRelations: Map<string, string> = new Map<
                string,
                string
            >();
            let mergedOverExtendsRelations: Map<string, string> = new Map<
                string,
                string
            >();

            for (const relationData of object) {
                const errorArray = relationData.getErrorsRelations();
                const missingRelationMap = relationData.getMissingRelations();
                const overExtendsRelationMap =
                    relationData.getOverExtendsRelations();

                mergedErrorArray = [...mergedErrorArray, ...errorArray];
                mergedMissingRelations = new Map([
                    ...mergedMissingRelations,
                    ...missingRelationMap,
                ]);
                mergedOverExtendsRelations = new Map([
                    ...mergedOverExtendsRelations,
                    ...overExtendsRelationMap,
                ]);

                upmmId = relationData.getUpmmId();
                id = relationData.getElementId();
            }

            const finalMergedErrorArray = [...new Set(mergedErrorArray)];

            const relationsError = new RelationErrorData(
                upmmId,
                id,
                finalMergedErrorArray,
                mergedMissingRelations,
                mergedOverExtendsRelations,
            );
            finalrelationErrorsData.push(relationsError);
        }

        const mergeFinalRelationErrorsData: RelationErrorData[] = [
            ...uniqueRelationErrorsData,
            ...finalrelationErrorsData,
        ];
        const percent =
            (1 - mergeFinalRelationErrorsData.length / templatesNodes.length) *
            100;

        const percents = analyzedData.getPercentArray();
        percents.push(percent);
        analyzedData.setPercentArray(percents);
        analyzedData.setRelationErrorData(mergeFinalRelationErrorsData);

        return analyzedData;
    }

    public async checkIncomingRelations(
        projectIncoming: string[],
        templateIncoming: string[],
        projectNodes: BpmnElementData[],
        projectElement: BpmnElementData,
        templateElement: BpmnElementData,
    ): Promise<RelationErrorData> {
        let missingMap = new Map<string, string>();
        let overExtendsMap = new Map<string, string>();
        let errorsRelations: string[] = [];

        if (projectIncoming.length < templateIncoming.length) {
            [errorsRelations, missingMap] =
                await this.checkMissingIncomingRelations(
                    projectIncoming,
                    templateIncoming,
                    projectNodes,
                    projectElement,
                    templateElement,
                    errorsRelations,
                    missingMap,
                );
        }

        if (projectIncoming.length > templateIncoming.length) {
            [errorsRelations, overExtendsMap] =
                await this.checkOverExtendsIngoingRelations(
                    projectIncoming,
                    templateIncoming,
                    projectNodes,
                    projectElement,
                    templateElement,
                    errorsRelations,
                    overExtendsMap,
                );
        }

        const relationsError = new RelationErrorData(
            projectElement.getUpmmUuid(),
            projectElement.getId(),
            errorsRelations,
            missingMap,
            overExtendsMap,
        );
        return relationsError;
    }

    public async checkOutgoingRelations(
        projectOutgoing: string[],
        templateOutgoing: string[],
        projectNodes: BpmnElementData[],
        projectElement: BpmnElementData,
        templateElement: BpmnElementData,
    ): Promise<RelationErrorData> {
        let missingMap = new Map<string, string>();
        let overExtendsMap = new Map<string, string>();
        let errorsRelations: string[] = [];

        if (projectOutgoing.length <= templateOutgoing.length) {
            [errorsRelations, missingMap] =
                await this.checkMissingOutgoingRelations(
                    projectOutgoing,
                    templateOutgoing,
                    projectNodes,
                    projectElement,
                    templateElement,
                    errorsRelations,
                    missingMap,
                );
        }

        if (projectOutgoing.length > templateOutgoing.length) {
            [errorsRelations, overExtendsMap] =
                await this.checkOverExtendsOutgoingRelations(
                    projectOutgoing,
                    templateOutgoing,
                    projectNodes,
                    projectElement,
                    templateElement,
                    errorsRelations,
                    overExtendsMap,
                );
        }

        const relationsError = new RelationErrorData(
            projectElement.getUpmmUuid(),
            projectElement.getId(),
            errorsRelations,
            missingMap,
            overExtendsMap,
        );

        return relationsError;
    }

    public async checkMissingIncomingRelations(
        projectUuids: string[],
        templateUuids: string[],
        projectNodes: BpmnElementData[],
        projectElement: BpmnElementData,
        templateElement: BpmnElementData,
        errorsRelations: string[],
        missingMap: Map<string, string>,
    ): Promise<any> {
        const differences = templateUuids.filter(
            (x) => !projectUuids.includes(x),
        );

        if (differences.length === 0 && projectUuids.length >= 2) {
            differences.push(projectUuids[0]);
        }

        for (const diff of differences) {
            const nodeFrom = await this.ontologyService.getOneNodeByUuid(diff);
            const nodeTo = await this.ontologyService.getOneNodeByUuid(
                templateElement.getUpmmUuid(),
            );
            const fromElement = projectNodes.filter(
                (x) => x.getUpmmUuid() === diff,
            );

            //errorsRelations.push(projectElement.getId());
            errorsRelations.push(fromElement[0].getId());
            missingMap.set(nodeFrom.getName(), nodeTo.getName());
        }

        return [errorsRelations, missingMap];
    }

    public async checkOverExtendsIngoingRelations(
        projectUuids: string[],
        templateUuids: string[],
        projectNodes: BpmnElementData[],
        projectElement: BpmnElementData,
        templateElement: BpmnElementData,
        errorsRelations: string[],
        overExtendsMap: Map<string, string>,
    ): Promise<any> {
        const differences = projectUuids.filter(
            (x) => !templateUuids.includes(x),
        );
        if (differences.length === 0 && projectUuids.length >= 2) {
            differences.push(projectUuids[0]);
        }

        for (const diff of differences) {
            const nodeFrom = await this.ontologyService.getOneNodeByUuid(diff);
            const nodeTo = await this.ontologyService.getOneNodeByUuid(
                templateElement.getUpmmUuid(),
            );

            const fromElement = projectNodes.filter(
                (x) => x.getUpmmUuid() === diff,
            );

            //errorsRelations.push(projectElement.getId());
            errorsRelations.push(fromElement[0].getId());
            overExtendsMap.set(nodeFrom.getName(), nodeTo.getName());
        }
        return [errorsRelations, overExtendsMap];
    }

    public async checkOverExtendsOutgoingRelations(
        projectUuids: string[],
        templateUuids: string[],
        projectNodes: BpmnElementData[],
        projectElement: BpmnElementData,
        templateElement: BpmnElementData,
        errorsRelations: string[],
        overExtendsMap: Map<string, string>,
    ): Promise<any> {
        const differences = projectUuids.filter(
            (x) => !templateUuids.includes(x),
        );

        if (differences.length === 0 && projectUuids.length >= 2) {
            differences.push(projectUuids[0]);
        }

        for (const diff of differences) {
            const nodeFrom = await this.ontologyService.getOneNodeByUuid(
                templateElement.getUpmmUuid(),
            );
            const nodeTo = await this.ontologyService.getOneNodeByUuid(diff);

            const fromElement = projectNodes.filter(
                (x) => x.getUpmmUuid() === diff,
            );

            //errorsRelations.push(projectElement.getId());
            errorsRelations.push(fromElement[0].getId());
            overExtendsMap.set(nodeFrom.getName(), nodeTo.getName());
        }
        return [errorsRelations, overExtendsMap];
    }

    public async checkMissingOutgoingRelations(
        projectUuids: string[],
        templateUuids: string[],
        projectNodes: BpmnElementData[],
        projectElement: BpmnElementData,
        templateElement: BpmnElementData,
        errorsRelations: string[],
        missingMap: Map<string, string>,
    ): Promise<any> {
        const differences = templateUuids.filter(
            (x) => !projectUuids.includes(x),
        );

        if (differences.length === 0 && projectUuids.length >= 2) {
            differences.push(projectUuids[0]);
        }

        for (const diff of differences) {
            const nodeFrom = await this.ontologyService.getOneNodeByUuid(
                templateElement.getUpmmUuid(),
            );
            const nodeTo = await this.ontologyService.getOneNodeByUuid(diff);

            const fromElement = projectNodes.filter(
                (x) => x.getUpmmUuid() === diff,
            );

            //errorsRelations.push(projectElement.getId());
            errorsRelations.push(fromElement[0].getId());
            missingMap.set(nodeFrom.getName(), nodeTo.getName());
        }

        return [errorsRelations, missingMap];
    }
}

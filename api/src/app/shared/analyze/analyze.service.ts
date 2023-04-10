import { Injectable } from '@nestjs/common';
import { BpmnElementData } from '../../bpmn/bpmnElement.data';
import { AnalyzeData } from './analyze.data';
import { OntologyService } from '../../ontology/ontology.service';
import { RelationErrorData } from './relationError.data';

@Injectable()
export class AnalyzeService {
    constructor(private readonly ontologyService: OntologyService) {}

    public async firstLevelAnalyze(
        projectNodesNames: string[],
        templatesNodesNames: string[],
    ): Promise<AnalyzeData> {
        const percentArray = [];
        const fullSuccess = templatesNodesNames.length;
        const areEqual = await this.eaqualArrays(
            projectNodesNames,
            templatesNodesNames,
        );

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

        //missing elements
        const missingElements = templatesNodesNames.filter(
            (value) => !projectNodesNames.includes(value),
        );
        const missing = await this.createMapOccurrences(missingElements);

        //overExtends elements
        const occurrencesOfProject = await this.createMapOccurrences(
            projectNodesNames,
        );

        const occurrencesOfTemplate = await this.createMapOccurrences(
            templatesNodesNames,
        );

        const overExtends = new Map<string, number>();
        for (const [name, projectOccurences] of occurrencesOfProject) {
            const templateOccurencesByName = occurrencesOfTemplate.get(name);
            const value = projectOccurences - templateOccurencesByName;
            if (value >= 1) {
                overExtends.set(name, value);
            }
        }

        const successfullNodes =
            fullSuccess - (missingElements.length + overExtends.size);
        const percentMatch = (successfullNodes / fullSuccess) * 100;
        percentArray.push(percentMatch);

        const analyzeData = new AnalyzeData(
            percentArray,
            missing,
            new Map<string, number>(),
            overExtends,
        );

        return analyzeData;
    }
    public async secondLevelAnalyze(
        projectElements: BpmnElementData[],
        templatesElements: BpmnElementData[],
        analyzedData: AnalyzeData,
    ): Promise<any> {
        const errorMap = new Map<string, string>();
        for (const templateElement of templatesElements) {
            const projectElement = projectElements.find((projectElement) => {
                return (
                    projectElement.getUpmmName() ===
                    templateElement.getElementId()
                );
            });

            if (projectElement.getType() !== templateElement.getType()) {
                errorMap.set(
                    projectElement.getUpmmName(),
                    templateElement.getType().split(':')[1],
                );
            }
        }

        if (errorMap.size === 0) {
            const percents = analyzedData.getPercentArray();
            percents.push(100);

            analyzedData.setPercentArray(percents);
            analyzedData.setShapeMap(new Map<string, string>());
            return analyzedData;
        }

        const percent = (1 - errorMap.size / templatesElements.length) * 100;
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
        const removeObjectsByValues = (
            projectNodesFiltered: BpmnElementData[],
            values: string[],
        ): BpmnElementData[] => {
            return projectNodesFiltered.filter(
                (project) => !values.includes(project.getId()),
            );
        };

        const relationErrorsData: RelationErrorData[] = [];
        const fixedID = [];
        const solvedIds = [];
        let equalIncoming = false;
        let equalOutgoing = false;

        // check when 2 elements with same UPMM have same number of incoming and outgoing..
        for (const templateElement of templatesNodes) {
            let projectNodesFiltered = projectNodes.filter((projectNode) => {
                return (
                    projectNode.getUpmmUuid() ===
                        templateElement.getUpmmUuid() &&
                    projectNode.getType() === templateElement.getType() &&
                    projectNode.getIncoming().length ===
                        templateElement.getIncoming().length &&
                    projectNode.getOutgoing().length ===
                        templateElement.getOutgoing().length
                );
            });

            if (projectNodesFiltered.length >= 2) {
                projectNodesFiltered = removeObjectsByValues(
                    projectNodesFiltered,
                    fixedID,
                );
                for (const project of projectNodesFiltered) {
                    const templateIncoming = templateElement
                        .getIncoming()
                        .sort();
                    const projectIncoming = project.getIncoming().sort();
                    const projectOutgoing = project.getOutgoing().sort();
                    const templateOutgoing = templateElement
                        .getOutgoing()
                        .sort();

                    equalIncoming = projectIncoming.every((val) =>
                        templateIncoming.includes(val),
                    );

                    equalOutgoing = projectOutgoing.every((val) =>
                        templateOutgoing.includes(val),
                    );
                    if (equalIncoming && equalOutgoing) {
                        fixedID.push(project.getId());
                        solvedIds.push(project.getId());
                        break;
                    }
                }
            }
        }

        //compare elements with same UPMM but different outgoin and incomming
        for (const templateElement of templatesNodes) {
            const projectNodesFiltered = projectNodes.filter((projectNode) => {
                return (
                    projectNode.getUpmmUuid() ===
                        templateElement.getUpmmUuid() &&
                    projectNode.getType() === templateElement.getType() &&
                    projectNode.getIncoming().length ===
                        templateElement.getIncoming().length &&
                    projectNode.getOutgoing().length ===
                        templateElement.getOutgoing().length
                );
            });
        }

        //BASE LINE relation checks
        for (const templateElement of templatesNodes) {
            for (const projectElement of projectNodes) {
                if (solvedIds.includes(projectElement.getId())) {
                    continue;
                }

                if (
                    projectElement.getUpmmUuid() ===
                        templateElement.getUpmmUuid() &&
                    projectElement.getType() === templateElement.getType()
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
                            templatesNodes,
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
                            templatesNodes,
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
        templatesNodes: BpmnElementData[],
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
                    templatesNodes,
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
                    templatesNodes,
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
        templatesNodes: BpmnElementData[],
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
                    templatesNodes,
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
                    templatesNodes,
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
        templatesNodes: BpmnElementData[],
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
        projectElement: BpmnElementData[],
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
        templatesNodes: BpmnElementData[],
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
        templatesNodes: BpmnElementData[],
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

    public async eaqualArrays(
        firstArray: string[],
        secondArray: string[],
    ): Promise<boolean> {
        return (
            firstArray.length === secondArray.length &&
            firstArray.every((value, index) => value === secondArray[index])
        );
    }

    public async createMapOccurrences(
        items: string[],
    ): Promise<Map<string, number>> {
        return items.reduce((count, name) => {
            count.set(name, (count.get(name) || 0) + 1);
            return count;
        }, new Map<string, number>());
    }
}

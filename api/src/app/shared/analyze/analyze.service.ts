import { Injectable } from '@nestjs/common';
import { BpmnElementData } from '../../bpmn/bpmnElement.data';
import { AnalyzeData } from './analyze.data';
import { RelationErrorData } from './relationError.data';
import { TemplateNodeService } from '../../template/templateNode/templateNode.service';
import { Template } from '../../template/template.entity';

@Injectable()
export class AnalyzeService {
    constructor(private readonly templateNodeService: TemplateNodeService) {}

    public async firstLevelAnalyze(
        projectNodesNames: string[],
        templateNodesNames: string[],
    ): Promise<AnalyzeData> {
        const percentArray = [];
        const fullSuccess = templateNodesNames.length;
        const areEqual = await this.eaqualArrays(
            projectNodesNames,
            templateNodesNames,
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
        const missingElements = templateNodesNames.filter(
            (value) => !projectNodesNames.includes(value),
        );
        const missing = await this.createMapOccurrences(missingElements);

        //overExtends elements
        const occurrencesOfProject = await this.createMapOccurrences(
            projectNodesNames,
        );

        const occurrencesOfTemplate = await this.createMapOccurrences(
            templateNodesNames,
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
        templateElements: BpmnElementData[],
        analyzedData: AnalyzeData,
    ): Promise<any> {
        const errorMap = new Map<string, string>();
        for (const templateElement of templateElements) {
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

        const percent = (1 - errorMap.size / templateElements.length) * 100;
        const percents = analyzedData.getPercentArray();
        percents.push(percent);
        analyzedData.setPercentArray(percents);
        analyzedData.setShapeMap(errorMap);

        return analyzedData;
    }

    public async thirdLevelAnalyze(
        projectElements: BpmnElementData[],
        templateElements: BpmnElementData[],
        analyzedData: AnalyzeData,
        template: Template,
    ): Promise<any> {
        const relationErrorsData: RelationErrorData[] = [];

        const allUniqueElementIdUsedInTemplate =
            await this.templateNodeService.getAllByTemplateVersion(template);

        const allIdNamesFromTemplate = allUniqueElementIdUsedInTemplate.map(
            (obj) => obj.getElementId(),
        );

        for (const templateElement of templateElements) {
            const projectElement = projectElements.find((projectElement) => {
                return (
                    projectElement.getUpmmName() ===
                    templateElement.getElementId()
                );
            });
            const templateIncoming = templateElement.getIncoming().sort();
            const templateOutgoing = templateElement.getOutgoing().sort();
            const projectIncoming = projectElement.getIncoming().sort();
            const projectOutgoing = projectElement.getOutgoing().sort();

            const areEqualIncoming = await this.eaqualArrays(
                templateIncoming,
                projectIncoming,
            );

            const areEqualOutgoing = await this.eaqualArrays(
                templateOutgoing,
                projectOutgoing,
            );

            if (!areEqualIncoming) {
                const data = await this.checkIncomingRelations(
                    projectIncoming,
                    templateIncoming,
                    projectElements,
                    templateElements,
                    projectElement,
                    templateElement,
                    allIdNamesFromTemplate,
                );
                relationErrorsData.push(data);
            }
            if (!areEqualOutgoing) {
                const data = await this.checkOutgoingRelations(
                    projectOutgoing,
                    templateOutgoing,
                    projectElements,
                    templateElements,
                    projectElement,
                    templateElement,
                    allIdNamesFromTemplate,
                );
                relationErrorsData.push(data);
            }
        }

        analyzedData = await this.parsingErrorDataToFrontendStructure(
            analyzedData,
            relationErrorsData,
            templateElements.length,
        );

        return analyzedData;
    }

    public async fourthLevelAnalyze(
        projectElements: BpmnElementData[],
        analyzedData: AnalyzeData,
    ): Promise<any> {
        let missingRelations: Map<string, string> = new Map<string, string>();
        for (const relationData of analyzedData.getRelationErrorData()) {
            missingRelations = new Map([
                ...Array.from(missingRelations.entries()),
                ...Array.from(relationData.getMissingRelations().entries()),
            ]);
        }
        let newAnalyzedData = analyzedData;
        let allOutgoingElements: string[] = [];
        for (const [key, value] of missingRelations) {
            const toElement = projectElements.find((projectElement) => {
                return projectElement.getUpmmName() === value;
            });
            const fromElement = projectElements.find((projectElement) => {
                return projectElement.getUpmmName() === key;
            });
            const outgoingElements = fromElement.getOutgoing();
            allOutgoingElements = [...allOutgoingElements, ...outgoingElements];

            while (allOutgoingElements.length !== 0) {
                const outgoingValue = allOutgoingElements.shift();
                const outgoingElement = projectElements.find(
                    (projectElement) => {
                        return projectElement.getId() === outgoingValue;
                    },
                );

                if (outgoingElement.getId() === toElement.getId()) {
                    newAnalyzedData = await this.changeAnalyzedData(
                        newAnalyzedData,
                        fromElement,
                        toElement,
                    );
                    break;
                } else {
                    allOutgoingElements = [
                        ...allOutgoingElements,
                        ...outgoingElement.getOutgoing(),
                    ];
                }
            }
        }

        return newAnalyzedData;
    }

    public async checkIncomingRelations(
        projectIncoming: string[],
        templateIncoming: string[],
        projectNodes: BpmnElementData[],
        templatesNodes: BpmnElementData[],
        projectElement: BpmnElementData,
        templateElement: BpmnElementData,
        allIdNamesFromTemplate: any[],
    ): Promise<RelationErrorData> {
        let missingMap = new Map<string, string>();
        let overExtendsMap = new Map<string, string>();
        let errorsRelations: string[] = [];

        if (projectIncoming.length <= templateIncoming.length) {
            [errorsRelations, missingMap] =
                await this.checkMissingIncomingRelations(
                    projectIncoming,
                    templateIncoming,
                    projectNodes,
                    templatesNodes,
                    templateElement,
                    errorsRelations,
                    missingMap,
                    allIdNamesFromTemplate,
                );
        }

        if (projectIncoming.length >= templateIncoming.length) {
            [errorsRelations, overExtendsMap] =
                await this.checkOverExtendsIngoingRelations(
                    projectIncoming,
                    templateIncoming,
                    projectNodes,
                    templatesNodes,
                    templateElement,
                    errorsRelations,
                    overExtendsMap,
                    allIdNamesFromTemplate,
                );
        }

        const relationsError = new RelationErrorData(
            projectElement.getUpmmName(),
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
        allIdNamesFromTemplate: any[],
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
                    allIdNamesFromTemplate,
                );
        }

        if (projectOutgoing.length >= templateOutgoing.length) {
            [errorsRelations, overExtendsMap] =
                await this.checkOverExtendsOutgoingRelations(
                    projectOutgoing,
                    templateOutgoing,
                    projectNodes,
                    templatesNodes,
                    templateElement,
                    errorsRelations,
                    overExtendsMap,
                    allIdNamesFromTemplate,
                );
        }

        const relationsError = new RelationErrorData(
            projectElement.getUpmmName(),
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
        allIdNamesFromTemplate: string[],
    ): Promise<any> {
        const differences = templateUuids.filter(
            (x) => !projectUuids.includes(x),
        );

        for (const diff of differences) {
            if (!allIdNamesFromTemplate.includes(diff)) {
                continue;
            }
            const nodeFrom = diff;
            const nodeTo = templateElement.getElementId();
            missingMap.set(nodeFrom, nodeTo);
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
        allIdNamesFromTemplate: string[],
    ): Promise<any> {
        const differences = projectUuids.filter(
            (x) => !templateUuids.includes(x),
        );

        for (const diff of differences) {
            /*if (!allIdNamesFromTemplate.includes(diff)) {
                continue;
            }*/
            const nodeFrom = diff;
            const nodeTo = templateElement.getElementId();
            overExtendsMap.set(nodeFrom, nodeTo);
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
        allIdNamesFromTemplate: string[],
    ): Promise<any> {
        const differences = projectUuids.filter(
            (x) => !templateUuids.includes(x),
        );

        for (const diff of differences) {
            /*if (!allIdNamesFromTemplate.includes(diff)) {
                continue;
            }*/
            const nodeFrom = templateElement.getElementId();
            const nodeTo = diff;
            overExtendsMap.set(nodeFrom, nodeTo);
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
        allIdNamesFromTemplate: string[],
    ): Promise<any> {
        const differences = templateUuids.filter(
            (x) => !projectUuids.includes(x),
        );

        for (const diff of differences) {
            if (!allIdNamesFromTemplate.includes(diff)) {
                continue;
            }
            const nodeFrom = templateElement.getElementId();
            const nodeTo = diff;
            missingMap.set(nodeFrom, nodeTo);
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

    public async parsingErrorDataToFrontendStructure(
        analyzedData: AnalyzeData,
        relationErrorsData: RelationErrorData[],
        numberOfTemplateElements: number,
    ): Promise<AnalyzeData> {
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
            (1 -
                mergeFinalRelationErrorsData.length /
                    numberOfTemplateElements) *
            100;

        const percents = analyzedData.getPercentArray();
        percents.push(percent);
        analyzedData.setPercentArray(percents);
        analyzedData.setRelationErrorData(mergeFinalRelationErrorsData);

        return analyzedData;
    }

    public async changeAnalyzedData(
        analyzedData: AnalyzeData,
        fromElement: BpmnElementData,
        toElement: BpmnElementData,
    ): Promise<AnalyzeData> {
        const relationObjectsError = analyzedData
            .getRelationErrorData()
            .filter(
                (relationObject) =>
                    relationObject.getElementId() === toElement.getId() ||
                    relationObject.getElementId() === fromElement.getId(),
            );

        const firstRelationErrorObject = relationObjectsError.find(
            (relationError) =>
                relationError.getUpmmId() === fromElement.getUpmmName(),
        );
        const secondRelationErrorObject = relationObjectsError.find(
            (relationError) =>
                relationError.getUpmmId() === toElement.getUpmmName(),
        );

        const firstMapOfObject = firstRelationErrorObject.getMissingRelations();
        const secondMapOfObject =
            secondRelationErrorObject.getMissingRelations();

        const firstMapOverExtendsOfObject =
            firstRelationErrorObject.getOverExtendsRelations();
        const secondMapOverExtendsOfObject =
            secondRelationErrorObject.getOverExtendsRelations();

        firstMapOfObject.delete(fromElement.getUpmmName());
        secondMapOfObject.delete(fromElement.getUpmmName());
        firstRelationErrorObject.setMissingRelations(firstMapOfObject);
        secondRelationErrorObject.setMissingRelations(secondMapOfObject);

        firstMapOverExtendsOfObject.delete(fromElement.getUpmmName());

        secondMapOverExtendsOfObject.forEach((value, key) => {
            if (value === toElement.getUpmmName()) {
                secondMapOverExtendsOfObject.delete(key);
            }
        });

        return analyzedData;
    }

    public async removeEmptyErrorData(
        analyzedData: AnalyzeData,
    ): Promise<AnalyzeData> {
        const relationObjectsError = analyzedData
            .getRelationErrorData()
            .filter(
                (relationObject) =>
                    relationObject.getMissingRelations().size !== 0 ||
                    relationObject.getOverExtendsRelations().size !== 0,
            );
        analyzedData.setRelationErrorData(relationObjectsError);
        return analyzedData;
    }
}

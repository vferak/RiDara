import { Test } from '@nestjs/testing';
import { AnalyzeService } from './analyze.service';
import { BpmnElementData } from '../../bpmn/bpmnElement.data';

describe('UserService', () => {
    let analyzeService: AnalyzeService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [AnalyzeService],
        }).compile();

        analyzeService = moduleRef.get<AnalyzeService>(AnalyzeService);
    });

    const templateNodesMap = new Map<string, number>();
    templateNodesMap.set('Action', 1);
    templateNodesMap.set('Argument', 1);
    templateNodesMap.set('Activity', 1);

    const projectNodesMapRight = new Map<string, number>();
    projectNodesMapRight.set('Action', 1);
    projectNodesMapRight.set('Argument', 1);
    projectNodesMapRight.set('Activity', 1);

    const projectNodesMapBad1 = new Map<string, number>();
    projectNodesMapBad1.set('Action', 1);
    projectNodesMapBad1.set('Argument', 1);

    const projectNodesMapBad2 = new Map<string, number>();
    projectNodesMapBad2.set('Action', 1);
    projectNodesMapBad2.set('Argument', 2);
    projectNodesMapBad2.set('Activity', 1);

    const projectNodesMapBad3 = new Map<string, number>();
    projectNodesMapBad3.set('Action', 1);
    projectNodesMapBad3.set('Argument', 1);
    projectNodesMapBad3.set('Problem', 1);

    const missingMapEmptyResult = new Map<string, number>();
    const missingMapResult1 = new Map<string, number>();
    missingMapResult1.set('Activity', 1);

    const notRecognizedMapEmptyResult = new Map<string, number>();
    const notRecognizedMapResult1 = new Map<string, number>();
    notRecognizedMapResult1.set('Problem', 1);

    const overExtendsMapEmptyResult = new Map<string, number>();
    const overExtendsMapResult1 = new Map<string, number>();
    overExtendsMapResult1.set('Argument', 1);

    const projectNodesRight: BpmnElementData[] = [];
    const projectNodesBad: BpmnElementData[] = [];
    const templatesNodes: BpmnElementData[] = [];
    let projectNode: BpmnElementData;
    let templateNode: BpmnElementData;

    templateNode = new BpmnElementData(
        'bpmn:Task',
        '1',
        'abca005e-4532-4caf-933c-343ac5784945',
    );
    templatesNodes.push(templateNode);
    templateNode = new BpmnElementData(
        'bpmn:Task',
        '2',
        '9df7e2ea-4e2d-4c97-9905-fad87935cb2c',
    );
    templatesNodes.push(templateNode);
    templateNode = new BpmnElementData(
        'bpmn:Task',
        '3',
        '8435c4d9-1c52-428c-923e-08497a965d34',
    );
    templatesNodes.push(templateNode);

    projectNode = new BpmnElementData(
        'bpmn:Task',
        '1',
        'abca005e-4532-4caf-933c-343ac5784945',
    );
    projectNodesRight.push(projectNode);
    projectNode = new BpmnElementData(
        'bpmn:Task',
        '2',
        '9df7e2ea-4e2d-4c97-9905-fad87935cb2c',
    );
    projectNodesRight.push(projectNode);
    projectNode = new BpmnElementData(
        'bpmn:Task',
        '3',
        '8435c4d9-1c52-428c-923e-08497a965d34',
    );
    projectNodesRight.push(projectNode);

    projectNode = new BpmnElementData(
        'bpmn:Gateway',
        '1',
        'abca005e-4532-4caf-933c-343ac5784945',
    );
    projectNodesBad.push(projectNode);
    projectNode = new BpmnElementData(
        'bpmn:StartEvent',
        '2',
        '9df7e2ea-4e2d-4c97-9905-fad87935cb2c',
    );
    projectNodesBad.push(projectNode);
    projectNode = new BpmnElementData(
        'bpmn:Task',
        '3',
        '8435c4d9-1c52-428c-923e-08497a965d34',
    );
    projectNodesBad.push(projectNode);

    const shapeMapEmptyResult = new Map<string, string>();
    const shapeMapResult2 = new Map<string, string>();
    shapeMapResult2.set('1', 'Task');
    shapeMapResult2.set('2', 'Task');

    const inputData = [
        [
            projectNodesMapRight,
            templateNodesMap,
            projectNodesRight,
            templatesNodes,
            missingMapEmptyResult,
            notRecognizedMapEmptyResult,
            overExtendsMapEmptyResult,
            shapeMapEmptyResult,
        ],
        [
            projectNodesMapRight,
            templateNodesMap,
            projectNodesBad,
            templatesNodes,
            missingMapEmptyResult,
            notRecognizedMapEmptyResult,
            overExtendsMapEmptyResult,
            shapeMapResult2,
        ],
        [
            projectNodesMapBad1,
            templateNodesMap,
            projectNodesRight,
            templatesNodes,
            missingMapResult1,
            notRecognizedMapEmptyResult,
            overExtendsMapEmptyResult,
            shapeMapEmptyResult,
        ],
        [
            projectNodesMapBad2,
            templateNodesMap,
            projectNodesRight,
            templatesNodes,
            missingMapEmptyResult,
            notRecognizedMapEmptyResult,
            overExtendsMapResult1,
            shapeMapEmptyResult,
        ],
        [
            projectNodesMapBad3,
            templateNodesMap,
            projectNodesRight,
            templatesNodes,
            missingMapResult1,
            notRecognizedMapResult1,
            overExtendsMapEmptyResult,
            shapeMapEmptyResult,
        ],
    ];
    describe('Analyze', () => {
        it.each(inputData)(
            "input is '%s'",
            async (
                projectNodesMap: Map<string, number>,
                templateNodesMap: Map<string, number>,
                projectNodes: BpmnElementData[],
                templatesNodes: BpmnElementData[],
                missingResult: Map<string, number>,
                notRecognizedResult: Map<string, number>,
                overExtendsResult: Map<string, number>,
                shapeResult: Map<string, string>,
            ) => {
                const analyzeData = await analyzeService.firstLevelAnalyze(
                    projectNodesMap,
                    templateNodesMap,
                    projectNodes,
                    templatesNodes,
                );

                expect(analyzeData.getMissingMap()).toEqual(missingResult);
                expect(analyzeData.getNotRecognizedMap()).toEqual(
                    notRecognizedResult,
                );
                expect(analyzeData.getOverExtendsMap()).toEqual(
                    overExtendsResult,
                );

                if (analyzeData.getShapeMap() !== undefined) {
                    expect(analyzeData.getShapeMap()).toEqual(shapeResult);
                } else {
                    expect(analyzeData.getShapeMap()).toBeUndefined();
                }
            },
        );
    });
});

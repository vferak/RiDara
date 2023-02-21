import { Injectable } from '@nestjs/common';
import { BpmnElementData } from '../../bpmn/bpmnElement.data';
import { AnalyzeData } from './analyze.data';

@Injectable()
export class AnalyzeService {
    public async firstLevelAnalyze(
        projectNodes: Map<string, number>,
        templatesNodes: Map<string, number>,
        projectNodesCopy: BpmnElementData[],
        templatesNodesCopy: BpmnElementData[],
    ): Promise<AnalyzeData> {
        let successfullNodes = 0;
        let badNodes = 0;
        const percentArray = [];

        console.log('Template map', templatesNodes);
        console.log('Bpmn map', projectNodes);
        const fullSuccess = templatesNodes.size;
        let areEqual: boolean;
        if (templatesNodes.size === projectNodes.size) {
            areEqual = [...templatesNodes.entries()].every(
                ([key, value], index) => {
                    return (
                        [key, value].toString() ===
                        [...projectNodes.entries()][index].toString()
                    );
                },
            );
        } else {
            areEqual = false;
        }

        if (areEqual) {
            const [percent, errorMap] = await this.secondLevelAnalyze(
                projectNodesCopy,
                templatesNodesCopy,
            );

            percentArray.push(100);
            percentArray.push(percent);

            const analyzeData = new AnalyzeData(
                percentArray,
                new Map(),
                new Map(),
                new Map(),
                errorMap,
            );

            return analyzeData;
        }

        const missing = new Map();
        const overExtends = new Map();
        const notRecognized = new Map();
        projectNodes.forEach((value, key) => {
            if (!templatesNodes.has(key)) {
                notRecognized.set(key, value);
                badNodes += 1;
            } else {
                if (!(templatesNodes.get(key) === value)) {
                    if (value > templatesNodes.get(key)) {
                        overExtends.set(key, value - templatesNodes.get(key));
                    } else {
                        notRecognized.set(key, value - templatesNodes.get(key));
                    }
                    badNodes += 1;
                }
            }
            if (templatesNodes.has(key) && templatesNodes.get(key) === value) {
                successfullNodes += 1;
            }
        });

        templatesNodes.forEach((value, key) => {
            if (!projectNodes.has(key)) {
                missing.set(key, value);
            } else {
                if (!(projectNodes.get(key) === value)) {
                    if (value > projectNodes.get(key)) {
                        missing.set(key, value);
                    }
                }
            }
        });

        console.log('Missing map', missing);
        console.log('Not recognized map', notRecognized);
        console.log('Over extends map', overExtends);
        console.log('Project right nodes', successfullNodes);
        console.log('Templates total nodes', fullSuccess);

        console.log(
            'Project rating:',
            (successfullNodes / fullSuccess) * 100,
            '%',
        );

        const percentMatch = (successfullNodes / fullSuccess) * 100;
        percentArray.push(percentMatch);
        percentArray.push(0);

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
            return [100, errorMap];
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

        return [percent, errorMap];
    }
}

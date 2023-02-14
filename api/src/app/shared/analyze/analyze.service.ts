import { Injectable } from '@nestjs/common';
import { BpmnElementData } from '../../bpmn/bpmnElement.data';

@Injectable()
export class AnalyzeService {
    public async firstLevelAnalyze(
        projectNodes: Map<string, number>,
        templatesNodes: Map<string, number>,
        projectNodesCopy: BpmnElementData[],
        templatesNodesCopy: BpmnElementData[],
    ): Promise<any> {
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

        const maps: Array<any> = [];

        if (areEqual) {
            const equalMaps: Array<any> = [new Map(), new Map(), new Map()];
            const [percent, errorMap] = await this.secondLevelAnalyze(
                projectNodesCopy,
                templatesNodesCopy,
            );
            const errorMapToJson = JSON.stringify(
                Array.from(errorMap.entries()),
            );

            equalMaps.push(errorMapToJson);
            percentArray.push(100);
            percentArray.push(percent);
            return [percentArray, equalMaps];
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
                        successfullNodes += 1;
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

        const missingToJson = JSON.stringify(Array.from(missing.entries()));
        const notRecognizedToJson = JSON.stringify(
            Array.from(notRecognized.entries()),
        );
        const overExtendsToJson = JSON.stringify(
            Array.from(overExtends.entries()),
        );
        const percentMatch = (successfullNodes / fullSuccess) * 100;
        percentArray.push(percentMatch);

        maps.push(missingToJson);
        maps.push(notRecognizedToJson);
        maps.push(overExtendsToJson);

        return [percentArray, maps];
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

import { Injectable } from '@nestjs/common';
import { BpmnData } from '../../bpmn/bpmn.data';

@Injectable()
export class AnalyzeService {
    public async firstLevelAnalyze(
        bpmnData: BpmnData,
        templatesNodes: Map<string, number>,
        templateReferences?: object,
    ): Promise<any> {
        let successfullNodes = 0;
        let badNodes = 0;
        console.log('Template map', templatesNodes);
        console.log('Bpmn map', bpmnData.getElements());
        const fullSuccess = templatesNodes.size;
        const areEqual = [...bpmnData.getElements().entries()].every(
            ([key, value], index) => {
                return (
                    [key, value].toString() ===
                    [...templatesNodes.entries()][index].toString()
                );
            },
        );

        if (areEqual) {
            return [100];
        }

        const missing = new Map();
        const overExtends = new Map();
        const notRecognized = new Map();
        bpmnData.getElements().forEach((value, key) => {
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
            if (!bpmnData.getElements().has(key)) {
                missing.set(key, value);
            } else {
                if (!(bpmnData.getElements().get(key) === value)) {
                    if (value > bpmnData.getElements().get(key)) {
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
        const maps: Array<any> = [
            missingToJson,
            notRecognizedToJson,
            overExtendsToJson,
        ];

        return [percentMatch, maps];
    }
}

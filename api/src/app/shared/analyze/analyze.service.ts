import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyzeService {
    public async firstLevelAnalyze(
        projectNodes: Map<string, number>,
        templatesNodes: Map<string, number>,
    ): Promise<any> {
        let successfullNodes = 0;
        let badNodes = 0;

        console.log('Template map', templatesNodes);
        console.log('Bpmn map', projectNodes);
        const fullSuccess = templatesNodes.size;

        const areEqual = [...templatesNodes.entries()].every(
            ([key, value], index) => {
                return (
                    [key, value].toString() ===
                    [...projectNodes.entries()][index].toString()
                );
            },
        );

        const emptyMaps: Array<any> = [new Map(), new Map(), new Map()];

        if (areEqual) {
            return [100, emptyMaps];
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
        const maps: Array<any> = [
            missingToJson,
            notRecognizedToJson,
            overExtendsToJson,
        ];

        return [percentMatch, maps];
    }
}

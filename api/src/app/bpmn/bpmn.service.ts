import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { BpmnData } from './bpmn.data';
import { BpmnElementData } from './bpmnElement.data';

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
                        ],
                    },
                ],
            },
        });
    }

    public async parseBpmnFile(pathToBpmn: string): Promise<BpmnData> {
        const moddle = this.createModdle();

        const bpmnFile = fs.readFileSync(pathToBpmn, 'utf8');

        const {
            rootElement: rootElement,
            elementsById: elementsById,
            references: references,
        } = await moddle.fromXML(bpmnFile);

        const objects = rootElement.get('rootElements')[0].flowElements;

        const bpmnElements = objects
            .filter(
                (object) =>
                    object !== undefined &&
                    object.upmmId !== undefined &&
                    object.upmmId !== '',
            )
            .map((object) => {
                return new BpmnElementData(
                    object.$type,
                    object.id,
                    object.upmmId,
                );
            });

        //     .map(async (object) => {
        //         return await this.ontologyNodeRepository.findOneOrFail(
        //             object.upmmId.toString(),
        //         );
        //     })
        //     .sort((a, b) => (a.getName() > b.getName()) ? 1 : ((b.getName() > a.getName()) ? -1 : 0))
        //     .reduce(
        //         (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
        //         new Map<string, number>(),
        //     );
        //
        // let nodesTotal = 0;
        // for (const [key, value] of map) {
        //     nodesTotal = nodesTotal + value;
        // }

        return new BpmnData(bpmnElements);
    }
}

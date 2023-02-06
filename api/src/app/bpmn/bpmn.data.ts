import { BpmnElementData } from './bpmnElement.data';

export class BpmnData {
    private readonly elements: BpmnElementData[];

    public constructor(elements: BpmnElementData[]) {
        this.elements = elements;
    }

    public getElements(): BpmnElementData[] {
        return this.elements;
    }
}

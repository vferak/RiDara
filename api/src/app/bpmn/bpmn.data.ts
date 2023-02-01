export class BpmnData {
    private numberOfElements: number;
    private elements: Map<string, number>;
    private references?: object;

    public constructor(
        numberOfElements: number,
        elements: Map<string, number>,
        references?: object,
    ) {
        this.numberOfElements = numberOfElements;
        this.elements = elements;
        this.references = references;
    }

    public getNumberOfElements(): number {
        return this.numberOfElements;
    }

    public getElements(): Map<string, number> {
        return this.elements;
    }

    public getReferences(): object {
        return this.references;
    }
}

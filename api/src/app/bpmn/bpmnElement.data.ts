export class BpmnElementData {
    private readonly type: string;
    private readonly id: string;
    private readonly upmmUuid: string;

    private outgoing?: string[];
    private incoming?: string[];

    private childElements?: BpmnElementData[];
    private parentId?: string;
    private upmmName?: string;
    private elementId?: string;

    public constructor(
        type: string,
        id: string,
        upmmUuid: string,
        outgoing?: string[],
        incoming?: string[],
        upmmName?: string,
        elementId?: string,
    ){
        this.type = type;
        this.id = id;
        this.upmmUuid = upmmUuid;
        this.incoming = incoming;
        this.outgoing = outgoing;
        this.childElements = [];
        this.parentId = '';
        this.upmmName = upmmName;
        this.elementId = elementId;
    }
    public setChildElements(values: BpmnElementData[]): void {
        this.childElements = values;
    }

    public setOutgoing(values: string[]): void {
        this.outgoing = values;
    }

    public setIncoming(values: string[]): void {
        this.incoming = values;
    }

    public setParentId(value: string): void {
        this.parentId = value;
    }

    public getParentId(): string {
        return this.parentId;
    }

    public getId(): string {
        return this.id;
    }

    public getType(): string {
        return this.type;
    }

    public getUpmmUuid(): string {
        return this.upmmUuid;
    }

    public getIncoming(): string[] {
        return this.incoming;
    }

    public getOutgoing(): string[] {
        return this.outgoing;
    }

    public getChildElements(): BpmnElementData[] {
        return this.childElements;
    }

    public getUpmmName(): string|undefined {
        return this.upmmName;
    }

    public getElementId(): string|undefined {
        return this.elementId;
    }
}

export class BpmnElementData {
    private readonly type: string;
    private readonly id: string;
    private readonly upmmUuid: string;

    private readonly outgoing?: string[];
    private readonly incoming?: string[];

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
    ) {
        this.type = type;
        this.id = id;
        this.upmmUuid = upmmUuid;
        this.incoming = incoming;
        this.outgoing = outgoing;
        this.upmmName = upmmName;
        this.elementId = elementId;
    }

    public getId() {
        return this.id;
    }

    public getType() {
        return this.type;
    }

    public getUpmmUuid() {
        return this.upmmUuid;
    }

    public getIncoming() {
        return this.incoming;
    }

    public getOutgoing() {
        return this.outgoing;
    }

    public getUpmmName(): string|undefined {
        return this.upmmName;
    }

    public getElementId(): string|undefined {
        return this.elementId;
    }
}

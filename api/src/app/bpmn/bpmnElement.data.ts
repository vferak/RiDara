export class BpmnElementData {
    private readonly type: string;
    private readonly id: string;
    private readonly upmmUuid: string;

    public constructor(type: string, id: string, upmmUuid: string) {
        this.type = type;
        this.id = id;
        this.upmmUuid = upmmUuid;
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
}

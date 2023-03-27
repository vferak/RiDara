export class DatabaseRelationAnalyzeData {
    private upmmUuid?: string;
    private outgoing?: string[];

    public constructor(
        upmmUuid?: string,
        outgoing?: string[],
    ) {
        this.upmmUuid = upmmUuid;
        this.outgoing = outgoing;
    }
    public getUpmmUuid(): string {
        return this.upmmUuid;
    }

    public getOutgoing(): string[] {
        return this.outgoing;
    }

    public setOutgoing(values: string[]): void {
        this.outgoing = values;
    }

    public setUpmmUuid(value: string): void {
        this.upmmUuid = value;
    }
}

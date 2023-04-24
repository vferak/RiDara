export class TemplateAnalyzeData {
    private upmmUuid?: string;
    private missing?: string[];
    private overExtends?: string[];
    private id?: string;

    public constructor(
        upmmUuid?: string,
        missing?: string[],
        overExtends?: string[],
        id?: string,
    ) {
        this.upmmUuid = upmmUuid;
        this.missing = missing;
        this.overExtends = overExtends;
        this.id = id;
    }
    public getUpmmUuid(): string {
        return this.upmmUuid;
    }

    public getMissing(): string[] {
        return this.missing;
    }

    public getOverExtends(): string[] {
        return this.overExtends;
    }

    public setMissing(values: string[]): void {
        this.missing = values;
    }

    public setOverExtends(values: string[]): void {
        this.overExtends = values;
    }

    public setUpmmUuid(value: string): void {
        this.upmmUuid = value;
    }
    public setId(value: string): void {
        this.id = value;
    }
}

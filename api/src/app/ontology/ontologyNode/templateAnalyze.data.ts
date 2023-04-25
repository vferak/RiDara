export class TemplateAnalyzeData {
    private upmmUuid?: string;
    private notPossible?: string[];
    private overExtends?: string[];
    private id?: string;

    public constructor(
        upmmUuid?: string,
        notPossible?: string[],
        overExtends?: string[],
        id?: string,
    ) {
        this.upmmUuid = upmmUuid;
        this.notPossible = notPossible;
        this.overExtends = overExtends;
        this.id = id;
    }

    public getId(): string {
        return this.id;
    }
    public getUpmmUuid(): string {
        return this.upmmUuid;
    }

    public getNotPossible(): string[] {
        return this.notPossible;
    }

    public getOverExtends(): string[] {
        return this.overExtends;
    }

    public setNotPossible(values: string[]): void {
        this.notPossible = values;
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

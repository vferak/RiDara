export class RelationErrorData {
    private upmmId: string;
    private elementId: string;
    private errorsRelations: string[];
    private missingRelations: Map<string, string>;
    private overExtendsRelations: Map<string, string>;

    public constructor(
        upmmId: string,
        elementId: string,
        errorsRelations: string[],
        missingRelations: Map<string, string>,
        overExtendsRelations: Map<string, string>,
    ) {
        this.upmmId = upmmId;
        this.elementId = elementId;
        this.errorsRelations = errorsRelations;
        this.missingRelations = missingRelations;
        this.overExtendsRelations = overExtendsRelations;
    }
    public getUpmmId(): string {
        return this.upmmId;
    }
    public getElementId(): string {
        return this.elementId;
    }

    public getErrorsRelations(): string[] {
        return this.errorsRelations;
    }

    public getMissingRelations(): Map<string, string> {
        return this.missingRelations;
    }

    public getOverExtendsRelations(): Map<string, string> {
        return this.overExtendsRelations;
    }
}

export class RelationErrorJsonData {
    private upmmId: string;
    private elementId: string;
    private errorsRelations: string[];
    private missingRelations: string;
    private overExtendsRelations: string;

    public constructor(
        upmmId: string,
        elementId: string,
        errorsRelations: string[],
        missingRelations: string,
        overExtendsRelations: string,
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

    public getMissingRelations(): string {
        return this.missingRelations;
    }

    public getOverExtendsRelations(): string {
        return this.overExtendsRelations;
    }
}

export class AnalyzedJsonData {
    private readonly percentArray: Array<number>;
    private readonly missingMap?: string;
    private readonly notRecognizedMap?: string;
    private readonly overExtendsMap?: string;
    private readonly shapeMap?: string;

    public constructor(
        percentArray?: Array<number>,
        missingMap?: string,
        notRecognizedMap?: string,
        overExtendsMap?: string,
        shapeMap?: string,
    ) {
        this.percentArray = percentArray;
        this.missingMap = missingMap;
        this.notRecognizedMap = notRecognizedMap;
        this.overExtendsMap = overExtendsMap;
        this.shapeMap = shapeMap;
    }
    public getMissingJson(): string {
        return this.missingMap;
    }
    public getNotRecognizedJson(): string {
        return this.notRecognizedMap;
    }

    public getOverExtendsJson(): string {
        return this.overExtendsMap;
    }

    public getShapeJson(): string {
        return this.shapeMap;
    }

    public getPercentArray(): Array<number> {
        return this.percentArray;
    }
}

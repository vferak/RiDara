import { RelationErrorJsonData } from './relationErrorJson.data';

export class AnalyzedJsonData {
    private readonly percentArray: number[];
    private readonly missingMap?: string;
    private readonly notRecognizedMap?: string;
    private readonly overExtendsMap?: string;
    private readonly shapeMap?: string;
    private readonly relationErrorJsonData?: RelationErrorJsonData[];

    public constructor(
        percentArray?: number[],
        missingMap?: string,
        notRecognizedMap?: string,
        overExtendsMap?: string,
        shapeMap?: string,
        relationErrorJsonData?: RelationErrorJsonData[],
    ) {
        this.percentArray = percentArray;
        this.missingMap = missingMap;
        this.notRecognizedMap = notRecognizedMap;
        this.overExtendsMap = overExtendsMap;
        this.shapeMap = shapeMap;
        this.relationErrorJsonData = relationErrorJsonData;
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

    public getPercentArray(): number[] {
        return this.percentArray;
    }

    public getRelationErrorData(): RelationErrorJsonData[] {
        return this.relationErrorJsonData;
    }
}

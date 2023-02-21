export class AnalyzeData {
    private readonly percentArray?: Array<number>;
    private readonly missingMap?: Map<string, number>;
    private readonly notRecognizedMap?: Map<string, number>;
    private readonly overExtendsMap?: Map<string, number>;
    private readonly shapeMap?: Map<string, string>;

    public constructor(
        percentArray?: Array<number>,
        missingMap?: Map<string, number>,
        notRecognizedMap?: Map<string, number>,
        overExtendsMap?: Map<string, number>,
        shapeMap?: Map<string, string>,
    ) {
        this.percentArray = percentArray;
        this.missingMap = missingMap;
        this.notRecognizedMap = notRecognizedMap;
        this.overExtendsMap = overExtendsMap;
        this.shapeMap = shapeMap;
    }
    public getMissingMap(): Map<string, number> {
        return this.missingMap;
    }
    public getNotRecognizedMap(): Map<string, number> {
        return this.notRecognizedMap;
    }

    public getOverExtendsMap(): Map<string, number> {
        return this.overExtendsMap;
    }

    public getShapeMap(): Map<string, string> {
        return this.shapeMap;
    }

    public getPercentArray(): Array<number> {
        return this.percentArray;
    }

    public mapToJson(map: Map<any, any>): string {
        if (map !== undefined) {
            if (map.size !== 0) {
                return JSON.stringify(Array.from(map.entries()));
            } else {
                return '';
            }
        } else {
            return '';
        }
    }
}

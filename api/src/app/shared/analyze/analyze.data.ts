import { RelationErrorData } from './relationError.data';
import { RelationErrorJsonData } from './relationErrorJson.data';

export class AnalyzeData {
    private percentArray?: number[];
    private missingMap?: Map<string, number>;
    private notRecognizedMap?: Map<string, number>;
    private overExtendsMap?: Map<string, number>;
    private shapeMap?: Map<string, string>;
    private relationErrorData?: RelationErrorData[];

    public constructor(
        percentArray?: number[],
        missingMap?: Map<string, number>,
        notRecognizedMap?: Map<string, number>,
        overExtendsMap?: Map<string, number>,
        shapeMap?: Map<string, string>,
        relationErrorData?: RelationErrorData[],
    ) {
        this.percentArray = percentArray;
        this.missingMap = missingMap;
        this.notRecognizedMap = notRecognizedMap;
        this.overExtendsMap = overExtendsMap;
        this.shapeMap = shapeMap;
        this.relationErrorData = relationErrorData;
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

    public getPercentArray(): number[] {
        return this.percentArray;
    }

    public getRelationErrorData(): RelationErrorData[] {
        return this.relationErrorData;
    }

    public setMissingMap(missingMap: Map<string, number>): void {
        this.missingMap = missingMap;
    }
    public setNotRecognizedMap(notRecognizedMap: Map<string, number>): void {
        this.notRecognizedMap = notRecognizedMap;
    }

    public setOverExtendsMap(overExtendsMap: Map<string, number>): void {
        this.overExtendsMap = overExtendsMap;
    }

    public setShapeMap(shapeMap: Map<string, string>): void {
        this.shapeMap = shapeMap;
    }

    public setPercentArray(percent: number[]): void {
        this.percentArray = percent;
    }

    public setRelationErrorData(relationErrorData: RelationErrorData[]): void {
        this.relationErrorData = relationErrorData;
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

    public relationErrorDataValuesToJson(
        relationErrorDatas: RelationErrorData[],
    ): RelationErrorJsonData[] {
        if (relationErrorDatas !== undefined) {
            const relationErrorJsonData: RelationErrorJsonData[] = [];
            for (const relationErrorData of relationErrorDatas) {
                const missingMapToJson = this.mapToJson(
                    relationErrorData.getMissingRelations(),
                );

                const overExtendsMapToJson = this.mapToJson(
                    relationErrorData.getOverExtendsRelations(),
                );
                const relationErrorJsonObject = new RelationErrorJsonData(
                    relationErrorData.getUpmmId(),
                    relationErrorData.getElementId(),
                    relationErrorData.getErrorsRelations(),
                    missingMapToJson,
                    overExtendsMapToJson,
                );

                relationErrorJsonData.push(relationErrorJsonObject);
            }
            return relationErrorJsonData;
        } else {
            return [];
        }
    }
}

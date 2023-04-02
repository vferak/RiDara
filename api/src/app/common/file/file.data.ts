import * as path from 'path';

export class FileData {
    private constructor(
        public readonly filePath: string,
        public readonly fileName: string,
    ) {}

    public static create(filePath: string, fileName: string): FileData {
        return new FileData(filePath, fileName);
    }

    public static createFromFilePathWithName(
        filePathWithName: string,
    ): FileData {
        return FileData.create(
            path.dirname(filePathWithName),
            path.basename(filePathWithName),
        );
    }

    public setFileName(fileName: string): FileData {
        return FileData.create(this.filePath, fileName);
    }

    public getFilePathWithName(): string {
        return path.join(this.filePath, this.fileName);
    }
}

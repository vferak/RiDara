import * as path from 'path';

export class FileData {
    private constructor(
        private readonly filePath: string,
        private readonly fileName: string,
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
        return FileData.create(this.getFilePath(), fileName);
    }

    public getFilePath(): string {
        return this.filePath;
    }

    public getFileName(): string {
        return this.fileName;
    }

    public getFilePathWithName(): string {
        return path.join(this.filePath, this.fileName);
    }
}

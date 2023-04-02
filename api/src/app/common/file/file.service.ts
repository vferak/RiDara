import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { FileData } from './file.data';

@Injectable()
export class FileService {
    public copyFile(source: FileData, destination: FileData): FileData {
        fs.copyFileSync(
            source.getFilePathWithName(),
            destination.getFilePathWithName(),
        );

        return destination;
    }

    public readFile(source: FileData): Buffer {
        return fs.readFileSync(source.getFilePathWithName());
    }

    public writeFile(source: FileData, file: Buffer | string): FileData {
        fs.writeFileSync(source.getFilePathWithName(), file);
        return source;
    }
}

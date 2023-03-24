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
}

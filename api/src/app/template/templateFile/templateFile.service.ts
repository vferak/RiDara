import { Injectable } from '@nestjs/common';
import { FileService } from '../../common/file/file.service';
import { FileData } from '../../common/file/file.data';
import {
    BPMN_BLANK_FILE_PATH,
    BPMN_FILE_EXTENSION,
    BPMN_RESOURCE_PATH,
} from '../../common/file/file.constants';
import { UuidInterface } from '../../common/uuid/uuid.interface';
import { TemplateVersion } from '../templateVersion/templateVersion.entity';
import * as path from 'path';

@Injectable()
export class TemplateFileService {
    private static BPMN_TEMPLATES_PATH = path.join(
        BPMN_RESOURCE_PATH,
        'template',
    );

    constructor(private readonly fileService: FileService) {}

    public writeTemplateFile(
        templateVersionUuid: UuidInterface,
        file: Buffer,
    ): FileData {
        return this.fileService.writeFile(
            FileData.create(
                TemplateFileService.BPMN_TEMPLATES_PATH,
                `${templateVersionUuid.asString()}${BPMN_FILE_EXTENSION}`,
            ),
            file,
        );
    }

    public copyTemplateVersionFile(
        templateVersion: TemplateVersion,
        newTemplateUuid: UuidInterface,
    ): FileData {
        const originalFileData = templateVersion.getFileData();

        return this.fileService.copyFile(
            originalFileData,
            originalFileData.setFileName(
                `${newTemplateUuid.asString()}${BPMN_FILE_EXTENSION}`,
            ),
        );
    }

    public getBlankTemplateFileBuffer(): Buffer {
        return this.fileService.readFile(
            FileData.createFromFilePathWithName(BPMN_BLANK_FILE_PATH),
        );
    }
}

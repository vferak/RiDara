import { Injectable } from '@nestjs/common';
import { FileService } from '../../common/file/file.service';
import { FileData } from '../../common/file/file.data';
import {
    BPMN_BLANK_FILE_PATH,
    BPMN_FILE_EXTENSION,
    BPMN_TEMPLATES_PATH,
} from '../../common/file/file.constants';
import { UuidInterface } from '../../common/uuid/uuid.interface';
import { TemplateVersion } from '../templateVersion/templateVersion.entity';

@Injectable()
export class TemplateFileService {
    constructor(private readonly fileService: FileService) {}

    public createBlankTemplateBpmnFile(fileName: UuidInterface): FileData {
        return this.fileService.copyFile(
            FileData.createFromFilePathWithName(BPMN_BLANK_FILE_PATH),
            FileData.create(
                BPMN_TEMPLATES_PATH,
                `${fileName.asString()}${BPMN_FILE_EXTENSION}`,
            ),
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
}

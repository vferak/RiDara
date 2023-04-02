import { Injectable } from '@nestjs/common';
import { FileService } from '../../common/file/file.service';
import { UuidInterface } from '../../common/uuid/uuid.interface';
import { FileData } from '../../common/file/file.data';
import {
    BPMN_FILE_EXTENSION,
    BPMN_RESOURCE_PATH,
} from '../../common/file/file.constants';
import * as path from 'path';

@Injectable()
export class ProjectFileService {
    private static BPMN_PROJECTS_PATH = path.join(
        BPMN_RESOURCE_PATH,
        'project',
    );

    constructor(private readonly fileService: FileService) {}

    public writeProjectFile(
        projectUuid: UuidInterface,
        file: Buffer,
    ): FileData {
        return this.fileService.writeFile(
            FileData.create(
                ProjectFileService.BPMN_PROJECTS_PATH,
                `${projectUuid.asString()}${BPMN_FILE_EXTENSION}`,
            ),
            file,
        );
    }
}

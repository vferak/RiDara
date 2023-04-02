import { Module } from '@nestjs/common';
import { ProjectFileService } from './projectFile.service';

@Module({
    providers: [ProjectFileService],
    exports: [ProjectFileService],
})
export class ProjectFileModule {}

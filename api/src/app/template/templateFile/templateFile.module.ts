import { Module } from '@nestjs/common';
import { TemplateFileService } from './templateFile.service';

@Module({
    providers: [TemplateFileService],
    exports: [TemplateFileService],
})
export class TemplateFileModule {}

import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import { Multer } from 'multer';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import { OntologyService } from './ontology.service';

@Controller('ontology')
export class OntologyController {
    constructor(private readonly ontologyService: OntologyService) {}

    @Post('loadFile')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createFileOntologyDto: CreateFileOntologyDto,
    ) {
        await this.ontologyService.loadFile(file, createFileOntologyDto);
    }
}

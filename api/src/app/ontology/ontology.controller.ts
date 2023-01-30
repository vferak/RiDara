import {
    Body,
    Controller,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { Express } from 'express';
import 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import { OntologyService } from './ontology.service';
import { OntologyFile } from './ontologyFile/ontologyFile.entity';

@Controller('ontology')
export class OntologyController {
    constructor(private readonly ontologyService: OntologyService) {}

    @Post('loadFile')
    @UseInterceptors(FileInterceptor('file'))
    public async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() createFileOntologyDto: CreateFileOntologyDto,
    ) {
        await this.ontologyService.loadFile(file, createFileOntologyDto);
    }

    @Get('files')
    public async displayFiles(): Promise<OntologyFile[]> {
        return this.ontologyService.findAll();
    }
}

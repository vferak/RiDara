import {
    Body,
    Controller,
    Get,
    Param,
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
import { OntologyNode } from './ontologyNode/ontologyNode.entity';
import { OntlogyFileByUuidPipe } from './pipes/ontlogyFile-by-uuid.pipe';

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

    @Get(':uuid/nodes')
    public async displayNodes(
        @Param('uuid', OntlogyFileByUuidPipe) ontologyFile: OntologyFile,
    ): Promise<OntologyNode[]> {
        return ontologyFile.getNodes();
    }
}

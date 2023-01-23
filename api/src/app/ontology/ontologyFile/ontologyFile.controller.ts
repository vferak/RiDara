import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import { OntologyFile } from './ontologyFile.entity';
import { OntologyFileService } from './ontologyFile.service';

@Controller('ontology')
export class OntologyFileController {
    constructor(private readonly ontologyFileService: OntologyFileService) {}

    @Post('loadFile')
    public async register(@Body() createFileOntologyDto: CreateFileOntologyDto): Promise<OntologyFile> {
        return this.ontologyFileService.loadFile(createFileOntologyDto);
    }
}

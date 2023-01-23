import { Injectable } from '@nestjs/common';
import { OntologyFileRepository } from './ontologyFIle.repository';
import { CreateFileOntologyDto } from './dto/create-file-ontology.dto';
import { OntologyFile } from './ontologyFile.entity';

@Injectable()
export class OntologyFileService {
    public constructor(
        private readonly ontologyFileRepository: OntologyFileRepository,
    ) {}

    public async loadFile(
        createFileOntologyDto: CreateFileOntologyDto,
    ): Promise<OntologyFile> {
        const ontologyFile = OntologyFile.create(createFileOntologyDto);
        await this.ontologyFileRepository.persistAndFlush(ontologyFile);

        return ontologyFile;
    }
}

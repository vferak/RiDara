import { OntologyFile } from '../ontologyFile/ontologyFile.entity';

export class CreateFileOntologyDto {
    public constructor(
        public name: string,
        public ontologyFile: OntologyFile,
    ) {}
}

import { Injectable, PipeTransform } from '@nestjs/common';
import { OntologyFile } from '../ontologyFile/ontologyFile.entity';
import { OntologyService } from '../ontology.service';

@Injectable()
export class OntlogyFileByUuidPipe
    implements PipeTransform<string, Promise<OntologyFile>>
{
    public constructor(private readonly ontologyService: OntologyService) {}

    public async transform(value: string): Promise<OntologyFile> {
        return this.ontologyService.getOneFileByUuid(value);
    }
}

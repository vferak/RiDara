import { Injectable, PipeTransform } from '@nestjs/common';
import { OntologyService } from '../ontology.service';
import { OntologyNode } from '../ontologyNode/ontologyNode.entity';

@Injectable()
export class OntlogyNodeByUuidPipe
    implements PipeTransform<string, Promise<OntologyNode>>
{
    public constructor(private readonly ontologyService: OntologyService) {}

    public async transform(value: string): Promise<OntologyNode> {
        return this.ontologyService.getOneNodeByUuid(value);
    }
}

import { Module } from '@nestjs/common';
import { OntologyController } from './ontology.controller';
import { OntologyService } from './ontology.service';
import { OntologyFileModule } from './ontologyFile/ontologyFile.module';
import { OntologyNodeModule } from './ontologyNode/ontologyNode.module';

@Module({
    imports: [OntologyFileModule, OntologyNodeModule],
    controllers: [OntologyController],
    providers: [OntologyService],
    exports: [OntologyService],
})
export class OntologyModule {}

import { Module } from '@nestjs/common';
import { OntologyController } from './ontology.controller';
import { OntologyService } from './ontology.service';
import { OntologyFileModule } from './ontologyFile/ontologyFile.module';
import { OntologyNodeModule } from './ontologyNode/ontologyNode.module';
import { OntologyRelationModule } from './ontologyRelation/ontologyRelation.module';

@Module({
    imports: [OntologyFileModule, OntologyNodeModule, OntologyRelationModule],
    controllers: [OntologyController],
    providers: [OntologyService],
    exports: [
        OntologyService,
        OntologyFileModule,
        OntologyNodeModule,
        OntologyRelationModule,
    ],
})
export class OntologyModule {}

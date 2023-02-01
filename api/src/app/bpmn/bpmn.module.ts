import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BpmnService } from './bpmn.service';
import { OntologyFile } from '../ontology/ontologyFile/ontologyFile.entity';
import { OntologyNode } from '../ontology/ontologyNode/ontologyNode.entity';

@Module({
    imports: [
        MikroOrmModule.forFeature([OntologyFile]),
        MikroOrmModule.forFeature([OntologyNode]),
    ],
    providers: [BpmnService],
    exports: [BpmnService, MikroOrmModule],
})
export class BpmnModule {}

import { Module } from '@nestjs/common';
import { BpmnService } from './bpmn.service';
import { OntologyModule } from '../ontology/ontology.module';

@Module({
    imports: [OntologyModule],
    providers: [BpmnService],
    exports: [BpmnService],
})
export class BpmnModule {}

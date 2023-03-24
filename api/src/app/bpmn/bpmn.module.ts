import { Module } from '@nestjs/common';
import { BpmnService } from './bpmn.service';

@Module({
    providers: [BpmnService],
    exports: [BpmnService],
})
export class BpmnModule {}

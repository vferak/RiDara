import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { Template } from './template.entity';
import { OntologyModule } from '../ontology/ontology.module';
import { BpmnModule } from '../bpmn/bpmn.module';
import { TemplateNodeModule } from './templateNode/templateNode.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([Template]),
        BpmnModule,
        OntologyModule,
        TemplateNodeModule,
    ],
    controllers: [TemplateController],
    providers: [TemplateService],
    exports: [TemplateService, MikroOrmModule],
})
export class TemplateModule {}

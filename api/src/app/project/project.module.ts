import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Project } from './project.entity';
import { AnalyzeModule } from '../shared/analyze/analyze.module';
import { BpmnModule } from '../bpmn/bpmn.module';
import { OntologyModule } from '../ontology/ontology.module';
import { TemplateModule } from '../template/template.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([Project]),
        AnalyzeModule,
        BpmnModule,
        OntologyModule,
        TemplateModule,
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService],
})
export class ProjectModule {}

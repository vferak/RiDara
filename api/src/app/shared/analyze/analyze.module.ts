import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { OntologyModule } from '../../ontology/ontology.module';
import { TemplateNodeModule } from '../../template/templateNode/templateNode.module';

@Module({
    imports: [OntologyModule, TemplateNodeModule],
    providers: [AnalyzeService],
    exports: [AnalyzeService],
})
export class AnalyzeModule {}

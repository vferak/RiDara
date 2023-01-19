import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { OntologyModule } from '../../ontology/ontology.module';

@Module({
    imports: [OntologyModule],
    providers: [AnalyzeService],
    exports: [AnalyzeService],
})
export class AnalyzeModule {}

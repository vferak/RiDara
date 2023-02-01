import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';

@Module({
    providers: [AnalyzeService],
    exports: [AnalyzeService],
})
export class AnalyzeModule {}

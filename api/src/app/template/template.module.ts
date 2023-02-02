import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { Template } from './template.entity';
import { OntologyModule } from '../ontology/ontology.module';

@Module({
    imports: [MikroOrmModule.forFeature([Template]), OntologyModule],
    controllers: [TemplateController],
    providers: [TemplateService],
    exports: [TemplateService, MikroOrmModule],
})
export class TemplateModule {}

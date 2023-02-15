import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TemplateNode } from './templateNode.entity';
import { TemplateNodeService } from './templateNode.service';
import { OntologyModule } from '../../ontology/ontology.module';

@Module({
    imports: [MikroOrmModule.forFeature([TemplateNode]), OntologyModule],
    providers: [TemplateNodeService],
    exports: [MikroOrmModule, TemplateNodeService],
})
export class TemplateNodeModule {}

import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Project } from './project.entity';
import { TemplateModule } from '../template/template.module';

@Module({
    imports: [MikroOrmModule.forFeature([Project]), TemplateModule],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService],
})
export class ProjectModule {}

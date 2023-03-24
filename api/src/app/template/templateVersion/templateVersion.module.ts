import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TemplateVersion } from './templateVersion.entity';

@Module({
    imports: [MikroOrmModule.forFeature([TemplateVersion])],
    exports: [MikroOrmModule],
})
export class TemplateVersionModule {}

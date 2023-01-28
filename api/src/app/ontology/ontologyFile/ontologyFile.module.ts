import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OntologyFile } from './ontologyFile.entity';

@Module({
    imports: [MikroOrmModule.forFeature([OntologyFile])],
    exports: [MikroOrmModule],
})
export class OntologyFileModule {}

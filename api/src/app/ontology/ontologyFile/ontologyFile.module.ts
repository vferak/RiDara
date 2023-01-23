import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OntologyFile } from './ontologyFile.entity';
import { OntologyFileController } from './ontologyFile.controller';
import { OntologyFileService } from './ontologyFile.service';

@Module({
    imports: [MikroOrmModule.forFeature([OntologyFile])],
    controllers: [OntologyFileController],
    providers: [OntologyFileService],
    exports: [OntologyFileService, MikroOrmModule],
})
export class OntologyFileModule {}

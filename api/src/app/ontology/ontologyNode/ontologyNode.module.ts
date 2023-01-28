import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OntologyNode } from './ontologyNode.entity';


@Module({
    imports: [MikroOrmModule.forFeature([OntologyNode])],
    exports: [MikroOrmModule],
})
export class OntologyNodeModule {}

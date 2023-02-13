import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OntologyRelation } from './ontologyRelation.entity';


@Module({
    imports: [MikroOrmModule.forFeature([OntologyRelation])],
    exports: [MikroOrmModule],
})
export class OntologyRelationModule {}

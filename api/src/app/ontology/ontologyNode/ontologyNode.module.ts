import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OntologyNodeController } from './ontologyNode.controller';
import { OntologyNode } from './ontologyNode.entity';
import { OntologyNodeService } from './ontologyNode.service';

@Module({
    imports: [MikroOrmModule.forFeature([OntologyNode])],
    controllers: [OntologyNodeController],
    providers: [OntologyNodeService],
    exports: [OntologyNodeService, MikroOrmModule],
})
export class OntologyNodeModule {}

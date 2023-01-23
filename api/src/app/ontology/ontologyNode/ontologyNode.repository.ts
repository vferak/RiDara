import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { OntologyNode } from './ontologyNode.entity';

@Injectable()
export class OntologyNodeRepository extends EntityRepository<OntologyNode> {}

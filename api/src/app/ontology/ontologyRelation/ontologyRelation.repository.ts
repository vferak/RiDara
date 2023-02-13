import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { OntologyRelation } from './ontologyRelation.entity';

@Injectable()
export class OntologyRelationRepository extends EntityRepository<OntologyRelation> {}

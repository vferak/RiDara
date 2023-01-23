import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { OntologyFile } from './ontologyFile.entity';

@Injectable()
export class OntologyFileRepository extends EntityRepository<OntologyFile> {}

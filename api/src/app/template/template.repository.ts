import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { Template } from './template.entity';

@Injectable()
export class TemplateRepository extends EntityRepository<Template> {}

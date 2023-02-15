import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { TemplateNode } from './templateNode.entity';

@Injectable()
export class TemplateNodeRepository extends EntityRepository<TemplateNode> {}

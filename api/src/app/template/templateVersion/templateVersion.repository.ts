import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { TemplateVersion } from './templateVersion.entity';

@Injectable()
export class TemplateVersionRepository extends EntityRepository<TemplateVersion> {}

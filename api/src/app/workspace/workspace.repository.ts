import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { Workspace } from './workspace.entity';

@Injectable()
export class WorkspaceRepository extends EntityRepository<Workspace> {}

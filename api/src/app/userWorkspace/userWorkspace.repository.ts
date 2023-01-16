import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { UserWorkspace } from './userWorkspace.entity';

@Injectable()
export class UserWorkspaceRepository extends EntityRepository<UserWorkspace> {}

import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { User } from './user.entity';

@Injectable()
export class UserRepository extends EntityRepository<User> {}

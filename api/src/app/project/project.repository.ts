import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/mariadb';
import { Project } from './project.entity';

@Injectable()
export class ProjectRepository extends EntityRepository<Project> {}

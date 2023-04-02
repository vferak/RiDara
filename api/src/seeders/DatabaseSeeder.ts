import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from './UserSeeder';
import { WorkspaceSeeder } from './WorkspaceSeeder';
import { OntologySeeder } from './OntologySeeder';
import { TemplateSeeder } from './TemplateSeeder';
import { ProjectSeeder } from './ProjectSeeder';

export class DatabaseSeeder extends Seeder {
    async run(entityManager: EntityManager): Promise<void> {
        return this.call(entityManager, [
            UserSeeder,
            WorkspaceSeeder,
            OntologySeeder,
            TemplateSeeder,
            ProjectSeeder,
        ]);
    }
}

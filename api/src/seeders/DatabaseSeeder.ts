import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from './UserSeeder';
import { WorkspaceSeeder } from './WorkspaceSeeder';
import { OntologySeeder } from './OntologySeeder';

export class DatabaseSeeder extends Seeder {
    async run(entityManager: EntityManager): Promise<void> {
        return this.call(entityManager, [
            UserSeeder,
            WorkspaceSeeder,
            OntologySeeder,
        ]);
    }
}

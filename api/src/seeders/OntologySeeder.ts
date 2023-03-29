import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as path from 'path';
import { TurtleService } from '../app/shared/turtle/turtle.service';
import * as fs from 'fs';
import { CreateFileOntologyDto } from '../app/ontology/dto/create-file-ontology.dto';
import { OntologyFile } from '../app/ontology/ontologyFile/ontologyFile.entity';

export class OntologySeeder extends Seeder {
    private static UPMM_TTL_FILE = path.join(
        process.cwd(),
        'src',
        'seeders',
        'resources',
        'UnifiedProcessMetaModel.ttl',
    );

    async run(entityManager: EntityManager): Promise<void> {
        const turtleService = new TurtleService();

        const file = fs.readFileSync(OntologySeeder.UPMM_TTL_FILE);
        const turtleData = turtleService.parseTurtleFile(file);

        const ontologyFile = OntologyFile.create(
            turtleData,
            new CreateFileOntologyDto('Unified Process Meta Model'),
        );

        await entityManager.persistAndFlush(ontologyFile);
    }
}

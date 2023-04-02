import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as path from 'path';
import { TurtleService } from '../app/shared/turtle/turtle.service';
import { CreateFileOntologyDto } from '../app/ontology/dto/create-file-ontology.dto';
import { OntologyFile } from '../app/ontology/ontologyFile/ontologyFile.entity';
import { FileService } from '../app/common/file/file.service';
import { FileData } from '../app/common/file/file.data';

export class OntologySeeder extends Seeder {
    private static UPMM_TTL_FILE = path.join(
        process.cwd(),
        'src',
        'seeders',
        'resources',
        'UnifiedProcessMetaModel.ttl',
    );

    async run(
        entityManager: EntityManager,
        context: Dictionary,
    ): Promise<void> {
        const fileService = new FileService();
        const turtleService = new TurtleService();

        const file = fileService.readFile(
            FileData.createFromFilePathWithName(OntologySeeder.UPMM_TTL_FILE),
        );

        const turtleData = turtleService.parseTurtleFile(file);

        const upmmOntology = OntologyFile.create(
            turtleData,
            new CreateFileOntologyDto('Unified Process Meta Model'),
        );

        await entityManager.persistAndFlush(upmmOntology);

        context.ontology = {
            upmm: upmmOntology,
        };
    }
}

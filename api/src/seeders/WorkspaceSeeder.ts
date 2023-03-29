import { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Workspace } from '../app/workspace/workspace.entity';
import { CreateWorkspaceDto } from '../app/workspace/dto/create-workspace.dto';

export class WorkspaceSeeder extends Seeder {
    async run(
        entityManager: EntityManager,
        context: Dictionary,
    ): Promise<void> {
        const adminUser = context.user.admin;
        const bestaUser = context.user.besta;
        const ferakUser = context.user.ferak;

        const adminWorkspace = await Workspace.create(
            new CreateWorkspaceDto('Admin workspace'),
            adminUser,
        );

        const bestaWorkspace = await Workspace.create(
            new CreateWorkspaceDto('Jiří Besta workspace'),
            bestaUser,
        );

        const ferakWorkspace = await Workspace.create(
            new CreateWorkspaceDto('Vojtěch Ferák workspace'),
            ferakUser,
        );

        const sharedWorkspace = await Workspace.create(
            new CreateWorkspaceDto('Shared workspace'),
            ferakUser,
        );

        await sharedWorkspace.addUser(bestaUser);

        await entityManager.persistAndFlush([
            adminWorkspace,
            bestaWorkspace,
            ferakWorkspace,
            sharedWorkspace,
        ]);

        context.workspace = {
            besta: bestaWorkspace,
            ferak: ferakWorkspace,
            shared: sharedWorkspace,
        };
    }
}

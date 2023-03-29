import type { Dictionary, EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from '../app/shared/user/user.entity';
import { CreateUserDto } from '../app/shared/user/dto/create-user.dto';
import { BcryptService } from '../app/common/providers/bcrypt.service';

export class UserSeeder extends Seeder {
    public async run(
        entityManager: EntityManager,
        context: Dictionary,
    ): Promise<void> {
        const bcryptService = new BcryptService();

        const adminUser = await User.create(
            bcryptService,
            new CreateUserDto('admin@admin.com', 'Admin', 'User', 'admin'),
        );

        adminUser.markAsAdmin();

        const bestaUser = await User.create(
            bcryptService,
            new CreateUserDto('besta@besta.com', 'Jiří', 'Besta', 'asd'),
        );

        const ferakUser = await User.create(
            bcryptService,
            new CreateUserDto('ferak@ferak.com', 'Vojtěch', 'Ferák', 'asd'),
        );

        await entityManager.persistAndFlush([adminUser, bestaUser, ferakUser]);

        context.user = {
            admin: adminUser,
            besta: bestaUser,
            ferak: ferakUser,
        };
    }
}

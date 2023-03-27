import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { UserRoleGuard } from './role/userRole.guard';

@Module({
    imports: [MikroOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [{ provide: APP_GUARD, useClass: UserRoleGuard }, UserService],
    exports: [UserService, MikroOrmModule],
})
export class UserModule {}

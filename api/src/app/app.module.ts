import configuration from '../../config/configuration';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from './user/user.module';
import {
    MikroOrmModuleAsyncOptions,
    MikroOrmModuleOptions,
} from '@mikro-orm/nestjs/typings';
import { ApiConfigService } from './common/providers/api-config.service';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';

const configModuleOptions: ConfigModuleOptions = {
    load: [configuration],
    cache: true,
};

const configMicroOrm: MikroOrmModuleAsyncOptions = {
    inject: [ApiConfigService],
    useFactory: (apiConfigService: ApiConfigService): MikroOrmModuleOptions => {
        const databaseConfig = apiConfigService.getDatabase();
        return {
            entities: ['./dist/src/**/**/*.entity.js'],
            entitiesTs: ['./src/**/**/*.entity.ts'],
            type: 'mariadb',
            host: databaseConfig.host,
            port: databaseConfig.port,
            user: databaseConfig.user,
            password: databaseConfig.password,
            dbName: databaseConfig.name,
        };
    },
};

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        MikroOrmModule.forRootAsync(configMicroOrm),
        CommonModule,
        AuthModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

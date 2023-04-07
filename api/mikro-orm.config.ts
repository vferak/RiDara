import configuration from './config/configuration';

import { MikroOrmModuleOptions } from '@mikro-orm/nestjs/typings';
import { ApiConfigService } from './src/app/common/providers/api-config.service';
import { ConfigService } from '@nestjs/config';

const createConfigMicroOrm = (
    apiConfigService: ApiConfigService,
): MikroOrmModuleOptions => {
    if (apiConfigService === undefined) {
        const configService = new ConfigService(configuration());
        apiConfigService = new ApiConfigService(configService);
    }

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
        migrations: {
            path: 'src/migrations',
        },
        seeder: {
            path: './dist/src/seeders', // path to the folder with seeders
            pathTs: './src/seeders', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
            defaultSeeder: 'DatabaseSeeder', // default seeder class name
        },
    };
};

export default createConfigMicroOrm;

import configuration from './config/configuration';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs/typings';
import { ApiConfigService } from './src/app/common/providers/api-config.service';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService(configuration());
const apiConfigService = new ApiConfigService(configService);
const databaseConfig = apiConfigService.getDatabase();
const configMicroOrm: MikroOrmModuleOptions = {
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

export default configMicroOrm;

import { MikroOrmModuleSyncOptions } from '@mikro-orm/nestjs/typings';

const env = process.env;

const config: MikroOrmModuleSyncOptions = {
    entities: ['./dist/src/**/**/*.entity.js'],
    entitiesTs: ['./src/**/**/*.entity.ts'],
    type: 'mariadb',
    host: env.DATABASE_HOST,
    port: +env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    dbName: env.DATABASE_NAME,
};

export default config;

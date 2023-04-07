import { INestApplication } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mariadb';
import { ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app/app.module';
import * as request from 'supertest';

export class TestApp {
    private app: INestApplication;
    private adminJwt: string;
    private entityManager: EntityManager;

    public async setup(): Promise<void> {
        const configService = new ConfigService(configuration(true));

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(ConfigService)
            .useValue(configService)
            .compile();

        this.app = moduleRef.createNestApplication();

        await this.app.init();

        this.entityManager = moduleRef.get<EntityManager>(EntityManager).fork();

        const response = await request(this.app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'admin@admin.com', password: 'admin' });

        this.adminJwt = response.text;
    }

    public async teardown(): Promise<void> {
        await this.app.close();
    }

    public async beforeTest(): Promise<void> {
        await this.entityManager.begin();
    }

    public async afterTest(): Promise<void> {
        await this.entityManager.rollback();
        this.entityManager.clear();
    }

    public appGet(url: string, asAdmin: boolean = true): request.Test {
        const get = request(this.app.getHttpServer()).get(url);

        if (asAdmin) {
            get.set('Authorization', `Bearer ${this.adminJwt}`);
        }

        return get;
    }

    public appPost(url: string, asAdmin: boolean = true): request.Test {
        const post = request(this.app.getHttpServer()).post(url);

        if (asAdmin) {
            post.set('Authorization', `Bearer ${this.adminJwt}`);
        }

        return post;
    }
}

export const test = new TestApp();

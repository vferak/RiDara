import { test } from "../test";

describe('Template', () => {
    it(`/POST user registration`, async () => {
        const response = await test
            .appPost('/user/register')
            .send({ email: 'test@test.com', firstName: 'Test', lastName: 'Tester', password: 'test'})

        expect(response.statusCode).toBe(201);
    });

    it(`/GET admin user profile`, async () => {
        const response = await test.appGet('/user/profile');

        expect(response.statusCode).toBe(200);
    });
});

import { test } from '../test';

describe('Template', () => {
    it(`/GET templates`, async () => {
        const response = await test.appGet('/template');

        expect(response.statusCode).toBe(200);
    });
});

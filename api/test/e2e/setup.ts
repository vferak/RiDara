import { test } from "./test";

global.beforeAll(async () => {
    await test.setup();
});

global.afterAll(async () => {
    await test.teardown();
});

global.beforeEach(async () => {
    await test.beforeTest();
});

global.afterEach(async () => {
    await test.afterTest();
});

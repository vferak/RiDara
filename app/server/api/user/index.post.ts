import $apiFetch from '~/server/apiFetch';

export default defineEventHandler(async (event): Promise<void> => {
    return await $apiFetch(event, `/user/register`, {
        method: 'POST',
        body: await readBody(event),
    });
})

import $apiFetch from '~/server/apiFetch';

export default defineEventHandler(async (event): Promise<void> => {
    return await $apiFetch(event, `/user`, {
        method: 'PATCH',
        body: await readBody(event),
    });
})

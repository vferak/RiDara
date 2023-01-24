import $apiFetch from '~/server/apiFetch';

export default defineEventHandler(async (event): Promise<void> => {
    const uuid = event.context.params.uuid;

    return await $apiFetch(event, `/workspace/${uuid}`, {
        method: 'PATCH',
        body: await readBody(event),
    });
})

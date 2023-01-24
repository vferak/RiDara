import $apiFetch from '~/server/apiFetch';
import { Workspace } from '~/server/types';

export default defineEventHandler(async (event): Promise<Workspace> => {
    return await $apiFetch(event, '/workspace', {
        method: 'POST',
        body: await readBody(event),
    });
})

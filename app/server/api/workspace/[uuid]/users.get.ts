import $apiFetch from '~/server/apiFetch';
import { Workspace } from '~/server/types';

export default defineEventHandler(async (event): Promise<Workspace> => {
    const uuid = event.context.params.uuid;

    return await $apiFetch(event, `/workspace/${uuid}/users`);
})

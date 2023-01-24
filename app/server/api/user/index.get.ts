import $apiFetch from '~/server/apiFetch';
import { User } from '~/server/types';

export default defineEventHandler(async (event): Promise<User> => {
    return await $apiFetch(event, `/user/profile`);
})

import $apiFetch from '~/server/apiFetch';

export default defineEventHandler(async (event): Promise<string> => {
    const body = await readBody(event);

    const response = await $apiFetch(event, '/auth/login', {
        method: 'POST',
        body: body,
    });

    setCookie(event, 'jwt', response);
    return response;
});

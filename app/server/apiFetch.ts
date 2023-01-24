import { getCookie, H3Event } from 'h3';
import { NitroFetchRequest } from 'nitropack';
import { FetchOptions } from 'ofetch';

const runtimeConfig = useRuntimeConfig();

const getHeaders = (event: H3Event) => {
    const jwtCookie = getCookie(event, 'jwt');

    const headers = new Headers();

    if (jwtCookie) {
        headers.set('Authorization', `Bearer ${jwtCookie}`);
    }

    return headers;
}

const $apiFetch = async <T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(
    event: H3Event,
    request: R,
    options: FetchOptions | undefined
): Promise<any> => {
    const $customFetch = $fetch.create({
        baseURL: runtimeConfig.public.API_URL,
        headers: getHeaders(event)
    });

    return await $customFetch(request, options);
}

export default $apiFetch;

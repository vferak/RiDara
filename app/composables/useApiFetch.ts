import { UseFetchOptions } from '#app';

export const useApiFetch = <DataT = unknown>(request: string, opts?: UseFetchOptions<DataT>) => {
    const runtimeConfig = useRuntimeConfig();
    const jwtCookie = useCookie<string|undefined>('jwt');

    if (opts === undefined) {
        opts = {};
    }

    const method = opts.method || 'GET';
    const headers = new Headers();

    if (jwtCookie.value) {
        headers.set('Authorization', `Bearer ${jwtCookie.value}`);
    }

    opts.headers = headers;
    opts.key = `${request}-${method}`

    return useFetch(`${runtimeConfig.public.API_URL}${request}`, opts);
}

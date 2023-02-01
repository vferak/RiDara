import { UseFetchOptions } from '#app';

export const useApiFetch = <DataT = unknown>(request: string, opts?: UseFetchOptions<DataT>) => {
    const runtimeConfig = useRuntimeConfig();
    const jwtCookie = useCookie<string|undefined>('jwt');

    if (opts === undefined) {
        opts = {
            headers: {}
        };
    }

    const method = opts.method || 'GET';

    if (jwtCookie.value) {
        opts.headers = {
            ...opts.headers,
            'Authorization': `Bearer ${jwtCookie.value}`
        };
    }

    opts.key = `${request}-${method}`

    return useFetch(`${runtimeConfig.public.API_URL}${request}`, opts);
}

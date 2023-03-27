import { UseFetchOptions } from '#app';

export const useApiFetch = async <DataT = unknown>(request: string, opts?: UseFetchOptions<DataT>) => {
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

    const result = await useFetch(`${runtimeConfig.public.API_URL}${request}`, opts);

    if (result.error?.value !== null && [401, 403].includes(result.error.value!.status!)) {
        navigateTo('/');
    }

    return result;
}

import { NitroFetchRequest } from 'nitropack';
import { FetchOptions } from 'ofetch';

export const useApiFetch = async <T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(request: R, opts?: FetchOptions | undefined): any => {
    const runtimeConfig = useRuntimeConfig();
    const auth = useAuth();

    const getHeaders = () => {
        const headers = new Headers();

        if (auth.isLoggedIn()) {
            headers.set('Authorization', `Bearer ${auth.getJWT()}`);
        }

        return headers;
    }


    const customFetch = $fetch.create({
        baseURL: runtimeConfig.public.API_URL,
        headers: getHeaders()
    })

    return await customFetch(request, opts)
}

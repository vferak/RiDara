import { NitroFetchRequest } from 'nitropack';
import { FetchOptions } from 'ofetch';

export const useApiFetch = async <T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(request: R, opts?: FetchOptions | undefined) => {
    const auth = useAuth();

    const getHeaders = () => {
        const headers = new Headers();

        if (auth.isLoggedIn()) {
            headers.set('Authorization', `Bearer ${auth.getJWT()}`);
        }

        return headers;
    }


    const customFetch = $fetch.create({
        baseURL: 'http://localhost:3000',
        headers: getHeaders()
    })

    return await customFetch(request, opts)
}

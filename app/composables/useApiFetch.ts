import { NitroFetchRequest } from 'nitropack';
import { FetchOptions } from 'ofetch';

export const useApiFetch = <T = unknown, R extends NitroFetchRequest = NitroFetchRequest>(request: R, opts?: FetchOptions | undefined) => {
    if (opts === undefined) {
        opts = {
            headers: new Headers()
        };
    }

    const headers = new Headers(opts.headers);
    const cookie = useRequestHeaders(['cookie']);

    if (cookie['cookie']) {
        headers.set('cookie', cookie['cookie']);
    }

    opts.headers = headers;

    return useFetch(request, opts);
}

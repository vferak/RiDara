import { useCurrentUser } from '~/composables/useCurrentUser';

export const useAuth = () => {
    const { clearCurrentUser } = useCurrentUser();
    const { clearCurrentWorkspace } = useCurrentWorkspace();


    const jwtCookie = useCookie<string|undefined>('jwt');

    const logIn = async (email: string, password: string): Promise<void> => {
        const body = { username: email, password: password };

        const { data: data, error: error } = await useApiFetch<string>(
            '/auth/login',
            {
                method: 'POST',
                body: body
            }
        );

        if (error.value) {
            logOut();

            throw error;
        }

        jwtCookie.value = data.value;
    }

    const logOut = (): void => {
        jwtCookie.value = undefined;
        clearCurrentUser();
        clearCurrentWorkspace();
        clearNuxtData();
    }

    const getJWT = (): string|undefined => {
        if (jwtCookie.value === null) {
            return undefined;
        }

        return jwtCookie.value;
    }

    const isLoggedIn = (): boolean => {
        return jwtCookie.value !== undefined;
    }

    return { logIn: logIn, isLoggedIn: isLoggedIn, logOut: logOut, getJWT: getJWT }
}

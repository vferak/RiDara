export const useAuth = () => {
    const jwtCookie = useCookie<string|undefined>('jwt');

    const logIn = async (email: string, password: string): Promise<void> => {
        const body = { username: email, password: password };

        const { error: error } = await useFetch('/api/auth', {
            method: 'POST',
            body: body
        });

        if (error.value) {
            logOut();

            throw error;
        }
    }

    const logOut = (): void => {
        jwtCookie.value = undefined;
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

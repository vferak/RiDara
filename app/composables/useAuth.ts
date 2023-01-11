export const useAuth = () => {
    const jwtCookie = useCookie<string|undefined>('jwt');

    const isLoggedIn = useState<boolean>(
        'isLoggedIn',
        () => jwtCookie.value !== undefined
    );

    const logIn = async (email: string, password: string): Promise<boolean> => {
        const body = {username: email, password: password};

        let errorStatus = 200;
        const { data: data } = await useFetch(
            'http://localhost:3000/auth/login',
            {
                method: 'POST',
                body: body,
                async onResponseError({ response }) {
                    errorStatus = response.status;
                },
            }
        );

        if (errorStatus >= 400) {
            return false;
        }

        jwtCookie.value = JSON.stringify(data.value);
        isLoggedIn.value = true;

        return true;
    }

    const logOut = (): void => {
        jwtCookie.value = undefined;
        isLoggedIn.value = false;
    }

    return { logIn: logIn, isLoggedIn: isLoggedIn, logOut: logOut }
}

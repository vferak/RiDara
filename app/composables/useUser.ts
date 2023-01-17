export const useUser = () => {

    const register = async (email: string, password: string): Promise<void> => {
        const body = {email: email, password: password};

        await useApiFetch(
            'http://localhost:3000/user/register',
            {
                method: 'POST',
                body: body,
            }
        );
    }
    return { register: register }
}

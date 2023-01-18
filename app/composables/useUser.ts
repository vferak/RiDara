export type User = {
    uuid: string,
    email: string,
    password: string,
    userWorkspaces: string[],
}

export const useUser = () => {

    const register = async (email: string, firstName: string, lastName: string, password: string): Promise<void> => {
        const body = {email: email, firstName: firstName, lastName: lastName, password: password};

        await useApiFetch(
            'http://localhost:3000/user/register',
            {
                method: 'POST',
                body: body,
            }
        );
    }

    const update = async (email: string, firstName: string, lastName: string, password: string): Promise<void> => {
        const body = {email: email, firstName: firstName, lastName: lastName, password: password};

        return await useApiFetch(
            'http://localhost:3000/user',
            {
                method: 'PATCH',
                body: body,
            }
        );
    }

    const getProfile = async (): Promise<User> => {

        return await useApiFetch(
            `/user/profile`
        );
    }

    return { update: update, getProfile: getProfile, register: register }
}

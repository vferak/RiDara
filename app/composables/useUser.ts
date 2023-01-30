export const useUser = () => {
    const userUrlPrefix = '/user';

    const registerUser = (email: string, firstName: string, lastName: string, password: string)=> {
        const body = {email: email, firstName: firstName, lastName: lastName, password: password};

        return useApiFetch(`${userUrlPrefix}/register`, {
            method: 'POST',
            body: body,
        });
    }

    const updateUser = (email: string, firstName: string, lastName: string, password: string) => {
        const body = {email: email, firstName: firstName, lastName: lastName, password: password};

        return useApiFetch(userUrlPrefix, {
            method: 'PATCH',
            body: body,
        });
    }

    const getUserProfile = () => {
        return useApiFetch(`${userUrlPrefix}/profile`);
    }

    return { updateUser: updateUser, getUserProfile: getUserProfile, registerUser: registerUser }
}

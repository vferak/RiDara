export const useUser = () => {
    const userUrl = '/api/user';

    const registerUser = (email: string, firstName: string, lastName: string, password: string)=> {
        const body = {email: email, firstName: firstName, lastName: lastName, password: password};

        return useApiFetch(userUrl, {
            method: 'POST',
            body: body,
        });
    }

    const updateUser = (email: string, firstName: string, lastName: string, password: string) => {
        const body = {email: email, firstName: firstName, lastName: lastName, password: password};

        return useApiFetch(userUrl, {
            method: 'PATCH',
            body: body,
        });
    }

    const getUserProfile = () => {
        return useApiFetch(userUrl);
    }

    return { updateUser: updateUser, getUserProfile: getUserProfile, registerUser: registerUser }
}

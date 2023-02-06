import { AsyncData } from '#app';
import { Project, User } from '~/composables/types';

export const useUser = () => {
    const userUrlPrefix = '/user';

    const registerUser = (email: string, firstName: string, lastName: string, password: string) => {
        const body = { email: email, firstName: firstName, lastName: lastName, password: password };

        return useApiFetch(`${userUrlPrefix}/register`, {
            method: 'POST',
            body: body,
        });
    };

    const updateUser = (email: string, firstName: string, lastName: string) => {
        const body = { email: email, firstName: firstName, lastName: lastName };

        return useApiFetch(userUrlPrefix, {
            method: 'PATCH',
            body: body,
        });
    };

    const updateUserPassword = (password: string) => {
        const body = { password: password };

        return useApiFetch(`${userUrlPrefix}/changePassword`, {
            method: 'PATCH',
            body: body,
        });
    };

    const getUser = async (): Promise<AsyncData<User, any>> => {
        return useApiFetch<User>(userUrlPrefix);
    };

    const getUserProfile = async (): Promise<AsyncData<{user: User, projects: Project[]}, any>> => {
        return useApiFetch<{user: User, projects: Project[]}>(`${userUrlPrefix}/profile`);
    };

    return {
        getUser: getUser,
        updateUser: updateUser,
        getUserProfile: getUserProfile,
        registerUser: registerUser,
        updateUserPassword: updateUserPassword,
    };
};

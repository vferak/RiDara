import { Project, User } from '~/composables/types';
import { AsyncData } from '#app';

export const useUser = () => {
    const userUrlPrefix = '/user';

    const registerUser = async (email: string, firstName: string, lastName: string, password: string): Promise<AsyncData<string, any>> => {
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

    const getUsers = async (): Promise<AsyncData<User[], any>> => {
        return useApiFetch<User[]>(`${userUrlPrefix}/all`);
    };

    return {
        getUser: getUser,
        updateUser: updateUser,
        getUserProfile: getUserProfile,
        registerUser: registerUser,
        updateUserPassword: updateUserPassword,
        getUsers: getUsers,
    };
};

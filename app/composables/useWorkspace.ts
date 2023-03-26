import { AsyncData } from '#app';
import { User, UserWorkspace, Workspace } from '~/composables/types';

export const useWorkspace = () => {
    const workspaceUrlPrefix = '/workspace';

    const createWorkspace = async (name: string): Promise<AsyncData<Workspace, any>> => {
        const body = { name: name };

        return useApiFetch<Workspace>(
            workspaceUrlPrefix,
            {
                method: 'POST',
                body: body,
            }
        );
    }

    const getWorkspaces = async (): Promise<AsyncData<Workspace[], any>> => {
        return useApiFetch<Workspace[]>(workspaceUrlPrefix);
    }

    const getWorkspace = async (uuid: string): Promise<AsyncData<Workspace, any>> => {
        return useApiFetch<Workspace>(
            `${workspaceUrlPrefix}/${uuid}`
        );
    }

    const getUsersFromWorkspace = async (uuid: string): Promise<AsyncData<UserWorkspace[], any>>  => {
        return useApiFetch<UserWorkspace[]>(`${workspaceUrlPrefix}/${uuid}/users`);
    }

    const getUsersNotInWorkspace = async (uuid: string): Promise<AsyncData<User[], any>>  => {
        return useApiFetch<User[]>(`${workspaceUrlPrefix}/${uuid}/users_not_in_workspace`);
    }

    const updateWorkspace = async (uuid: string, name: string) => {
        const body = { name: name };

        return useApiFetch(
            `${workspaceUrlPrefix}/${uuid}`, {
                method: 'PATCH',
                body: body,
            }
        );
    }

    const deleteWorkspace = async (workspaceUuid: string) => {
        return useApiFetch(`${workspaceUrlPrefix}/${workspaceUuid}`, {
            method: 'DELETE',
        });
    };

    const addUserToWorkspace = async (userUuid: string, workspaceUuid: string) => {
        const body = { userUuid: userUuid, workspaceUuid: workspaceUuid};

        return useApiFetch(
            `${workspaceUrlPrefix}/${workspaceUuid}/add_user`, {
                method: 'POST',
                body: body,
            }
        );
    }

    const removeUserFromWorkspace = async (userUuid: string, workspaceUuid: string) => {
        const body = { userUuid: userUuid, workspaceUuid: workspaceUuid };

        return useApiFetch(
            `${workspaceUrlPrefix}/${workspaceUuid}/remove_user`, {
                method: 'POST',
                body: body,
            }
        );
    }


    return {
        getWorkspaces: getWorkspaces,
        createWorkspace: createWorkspace,
        getWorkspace: getWorkspace,
        getUsersFromWorkspace: getUsersFromWorkspace,
        updateWorkspace: updateWorkspace,
        addUserToWorkspace: addUserToWorkspace,
        removeUserFromWorkspace: removeUserFromWorkspace,
        getUsersNotInWorkspace: getUsersNotInWorkspace,
        deleteWorkspace: deleteWorkspace,
    };
}

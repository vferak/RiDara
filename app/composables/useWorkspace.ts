import { AsyncData } from '#app';
import { Workspace } from '~/composables/types';

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

    const getWorkspace = (uuid: string) => {
        return useApiFetch(`${workspaceUrlPrefix}/${uuid}/settings`);
    }

    const getUsersFromWorkspace = (uuid: string) => {
        return useApiFetch(`${workspaceUrlPrefix}/${uuid}/users`);
    }

    const updateWorkspace = (uuid: string, name: string) => {
        const body = { name: name };

        return useApiFetch(
            `${workspaceUrlPrefix}/${uuid}`, {
                method: 'PATCH',
                body: body,
            }
        );
    }

    return {
        getWorkspaces: getWorkspaces,
        createWorkspace: createWorkspace,
        getWorkspace: getWorkspace,
        getUsersFromWorkspace: getUsersFromWorkspace,
        updateWorkspace: updateWorkspace
    };
}

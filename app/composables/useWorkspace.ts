export const useWorkspace = () => {
    const workspaceUrl = '/api/workspace';

    const createWorkspace = (name: string) => {
        const body = { name: name };

        return useApiFetch(
            workspaceUrl,
            {
                method: 'POST',
                body: body,
            }
        );
    }

    const getWorkspaces = () => {
        return useApiFetch(workspaceUrl);
    }

    const getWorkspace = (uuid: string) => {
        return useApiFetch(`${workspaceUrl}/${uuid}`);
    }

    const getUsersFromWorkspace = (uuid: string) => {
        return useApiFetch(`${workspaceUrl}/${uuid}/users`);
    }

    const updateWorkspace = (uuid: string, name: string) => {
        const body = { name: name };

        return useApiFetch(
            `${workspaceUrl}/${uuid}`, {
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

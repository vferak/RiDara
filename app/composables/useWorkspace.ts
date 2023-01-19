import { User } from '~/composables/useUser';

export type Workspace = {
    uuid: string,
    name: string,
    owner: User,
}

export const useWorkspace = () => {

    const create = async (name: string): Promise<void> => {
        const body = {name: name};

        return await useApiFetch(
            'http://localhost:3000/workspace',
            {
                method: 'POST',
                body: body,
            }
        );
    }

    const getWorkspaces = async (): Promise<Workspace[]> => {

        return await useApiFetch(
            `/workspace`
        );
    }

    const getWorkspace = async (uuid: string): Promise<Workspace> => {

        return await useApiFetch(
            `/workspace/${uuid}/settings`,
        );
    }

    const getUsersFromWorkspace = async (uuid: string): Promise<User[]> => {

        return await useApiFetch(
            `/workspace/${uuid}/users`,
        );
    }

    const getUsersNotInWorkspace = async (uuid: string): Promise<User[]> => {

        return await useApiFetch(
            `/workspace/${uuid}/usersNotInWorkspace`,
        );
    }

    const update = async (uuid: string, name: string): Promise<void> => {
        const body = {name: name};

        return await useApiFetch(
            `http://localhost:3000/workspace/${uuid}`,
            {
                method: 'PATCH',
                body: body,
            }
        );
    }

    const deleteWorkspace = async (uuid: string): Promise<void> => {
        return await useApiFetch(
            `http://localhost:3000/workspace/${uuid}`,
            {
                method: 'DELETE',
            }
        );
    }

    const removeUserFromWorkspace = async (workspaceUuid: string, userUuid: string): Promise<void> => {
        const body = {workspaceUuid: workspaceUuid, userUuid: userUuid};

        return await useApiFetch(
            `http://localhost:3000/workspace/remove_user`,
            {
                method: 'POST',
                body: body,
            }
        );
    }

    const addUserToWorkspace = async (workspaceUuid: string, userUuid: string): Promise<void> => {
        const body = {workspaceUuid: workspaceUuid, userUuid: userUuid, role: 'admin'};

        return await useApiFetch(
            `http://localhost:3000/workspace/add_user`,
            {
                method: 'POST',
                body: body,
            }
        );
    }

    return { getWorkspaces:getWorkspaces, create:create, getWorkspace:getWorkspace, getUsersFromWorkspace:getUsersFromWorkspace,
        update: update,deleteWorkspace: deleteWorkspace, removeUserFromWorkspace:removeUserFromWorkspace, addUserToWorkspace: addUserToWorkspace,
        getUsersNotInWorkspace: getUsersNotInWorkspace}
}

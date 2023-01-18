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


    return { getWorkspaces:getWorkspaces, create:create, getWorkspace:getWorkspace, getUsersFromWorkspace:getUsersFromWorkspace, update: update }
}

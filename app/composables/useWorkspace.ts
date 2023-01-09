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

    return { getWorkspaces:getWorkspaces, create:create }
}

import { AsyncData } from '#app';
import { Project, Workspace } from '~/composables/types';

export const useProject = () => {
    const projectUrlPrefix = '/project';

    const createProject = async (name: string, workspace: Workspace): Promise<AsyncData<Project, any>> => {
        const body = { name: name, workspace: workspace };
        return useApiFetch<Project>(
            projectUrlPrefix,
            {
                method: 'POST',
                body: body,
            }
        );
    }

    const getProjects = async (uuid: string): Promise<AsyncData<Project[], any>> => {
        return useApiFetch<Project[]>(`${projectUrlPrefix}/user/${uuid}`);
    }

    const updateProject = (uuid: string, name: string) => {
        const body = { name: name };

        return useApiFetch(
            `${projectUrlPrefix}/${uuid}`, {
                method: 'PATCH',
                body: body,
            }
        );
    }

    return {
        getProjects: getProjects,
        createProject: createProject,
        updateProject: updateProject
    };
}

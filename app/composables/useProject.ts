import { AsyncData } from '#app';
import { OntologyNode, Project, Workspace } from '~/composables/types';

export const useProject = () => {
    const projectUrlPrefix = '/project';

    const createProject = async (name: string, workspace: Workspace, templateUuid: string, blankFile: boolean): Promise<AsyncData<Project, any>> => {
        const body = { name: name, workspace: workspace, templateUuid: templateUuid, blankFile: blankFile };
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
            `${projectUrlPrefix}/update/${uuid}`, {
                method: 'PATCH',
                body: body,
            }
        );
    }

    const getProjectFile = async (uuid: string): Promise<AsyncData<string, any>> => {
        return useApiFetch<string>(`${projectUrlPrefix}/${uuid}/file`);
    }

    const saveProjectBpmnFile = async (projectUuid: string, xml: string): Promise<AsyncData<void, any>> => {
        console.log(projectUuid);
        return useApiFetch<void>(`${projectUrlPrefix}/saveFile`, {
            method: 'PATCH',
            body: {
                projectUuid: projectUuid,
                bpmnFileData: xml
            }
        });
    }

    const analyzeFirstLevel = (uuid: string) => {
        return useApiFetch(
            `${projectUrlPrefix}/${uuid}/analyze1`, {
                method: 'GET',
            }
        );
    }

    const getNodesByProject = async (uuid: string): Promise<AsyncData<OntologyNode[], any>> => {
        return useApiFetch<OntologyNode[]>(
            `${projectUrlPrefix}/${uuid}/nodes`,
        );
    }


    return {
        getProjects: getProjects,
        createProject: createProject,
        updateProject: updateProject,
        getProjectFile: getProjectFile,
        saveProjectBpmnFile: saveProjectBpmnFile,
        analyzeFirstLevel: analyzeFirstLevel,
        getNodesByProject: getNodesByProject,
    };
}

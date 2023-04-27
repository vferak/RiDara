import { AsyncData } from '#app';
import { AnalyzedJsonData, OntologyNode, Project, Workspace } from '~/composables/types';

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

    const importProject = async (name: string, workspace: string, file: File, templateUuid: string): Promise<AsyncData<Project, any>> => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('workspace', workspace);
        formData.append('file', file);
        formData.append('templateUuid', templateUuid);

        return useApiFetch<Project>(
            `${projectUrlPrefix}/import`,
            {
                method: 'POST',
                body: formData,
            }
        );
    }

    const deleteProject = async (projectUuid: string): Promise<AsyncData<void, any>> => {
        const body = { projectUuid: projectUuid };
        return useApiFetch<void>(
            `${projectUrlPrefix}/delete`,
            {
                method: 'DELETE',
                body: body,
            }
        );
    }

    const getProjects = async (uuid: string): Promise<AsyncData<Project[], any>> => {
        return useApiFetch<Project[]>(`${projectUrlPrefix}/workspace/${uuid}`);
    }

    const updateProject = (uuid: string, name: string, workspace: string, templateUuid: string) => {
        const body = { name: name, workspace: workspace,templateUuid: templateUuid };
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
        return useApiFetch<void>(`${projectUrlPrefix}/saveFile`, {
            method: 'PATCH',
            body: {
                projectUuid: projectUuid,
                bpmnFileData: xml
            }
        });
    }

    const analyze = async (uuid: string): Promise<AsyncData<AnalyzedJsonData, any>> => {
        return useApiFetch<AnalyzedJsonData>(
            `${projectUrlPrefix}/${uuid}/analyze`, {
                method: 'GET',
            }
        );
    }

    const analyzeFirstLevel = async (uuid: string): Promise<AsyncData<AnalyzedJsonData, any>> => {
        return useApiFetch<AnalyzedJsonData>(
            `${projectUrlPrefix}/${uuid}/analyze1`, {
                method: 'GET',
            }
        );
    }

    const analyzeSecondLevel = async (uuid: string) => {
        return useApiFetch(
            `${projectUrlPrefix}/${uuid}/analyze2`, {
                method: 'GET',
            }
        );
    }

    const analyzeThirdLevel = async (uuid: string) => {
        return useApiFetch(
            `${projectUrlPrefix}/${uuid}/analyze3`, {
                method: 'GET',
            }
        );
    }

    const getNodesByProject = async (uuid: string): Promise<AsyncData<OntologyNode[], any>> => {
        return useApiFetch<OntologyNode[]>(
            `${projectUrlPrefix}/${uuid}/nodes`,
        );
    }

    const checkForNewProjectTemplateVersion = async (
        uuid: string,
    ): Promise<AsyncData<string, any>> => {
        return useApiFetch(
            `${projectUrlPrefix}/${uuid}/check-for-new-template-version`,
        );
    }

    const updateProjectToNewTemplateVersion = async (
        uuid: string,
    ): Promise<AsyncData<boolean, any>> => {
        return useApiFetch(
            `${projectUrlPrefix}/${uuid}/update-template-version`,
            { method: 'PATCH' },
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
        importProject: importProject,
        analyzeSecondLevel: analyzeSecondLevel,
        analyzeThirdLevel: analyzeThirdLevel,
        analyze: analyze,
        deleteProject: deleteProject,
        checkForNewProjectTemplateVersion: checkForNewProjectTemplateVersion,
        updateProjectToNewTemplateVersion: updateProjectToNewTemplateVersion,
    };
}

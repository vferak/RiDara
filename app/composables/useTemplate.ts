import { AsyncData } from '#app';
import { Template } from '~/composables/types';

export const useTemplate = () => {
    const templateUrlPrefix = '/template';

    const createTemplate = async (
        name: string,
        ontologyFileUuid: string
    ): Promise<AsyncData<Template, any>> => {
        const body = { name: name, ontologyFileUuid:  ontologyFileUuid };

        return useApiFetch<Template>(
            templateUrlPrefix,
            {
                method: 'POST',
                body: body,
            }
        );
    }

    const editTemplate = async (
        templateUuid: string,
        name: string,
    ): Promise<AsyncData<Template, any>> => {
        const body = { name: name };

        return useApiFetch<Template>(
            `${templateUrlPrefix}/${templateUuid}`,
            {
                method: 'PATCH',
                body: body,
            }
        );
    }

    const getTemplates = async (): Promise<AsyncData<Template[], any>> => {
        return useApiFetch<Template[]>(templateUrlPrefix);
    }

    const getTemplate = async (templateUuid: string): Promise<AsyncData<Template, any>> => {
        return useApiFetch<Template>(`${templateUrlPrefix}/${templateUuid}`);
    }

    const getTemplateBpmnFile = async (templateUuid: string): Promise<AsyncData<string, any>> => {
        return useApiFetch<string>(`${templateUrlPrefix}/${templateUuid}/file`);
    }

    const saveTemplateBpmnFile = async (templateUuid: string, xml: string): Promise<AsyncData<void, any>> => {
        return useApiFetch<void>(`${templateUrlPrefix}/save-file`, {
            method: 'PATCH',
            body: {
                templateUuid: templateUuid,
                bpmnFileData: xml
            }
        });
    }

    const publishTemplate = async (templateUuid: string): Promise<AsyncData<void, any>> => {
        return useApiFetch<void>(
            `${templateUrlPrefix}/${templateUuid}/publish`,
            {
                method: 'PATCH',
            }
        );
    }

    const analyze = async (uuid: string): Promise<AsyncData<void, any>> => {
        return useApiFetch<void>(
            `${templateUrlPrefix}/${uuid}/analyze`, {
                method: 'GET',
            }
        );
    }

    const importTemplate = async (
        name: string,
        ontologyFileUuid: string,
        file: File
    ): Promise<AsyncData<Template, any>> => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('ontologyFileUuid', ontologyFileUuid);
        formData.append('file', file);

        return useApiFetch<Template>(
            `${templateUrlPrefix}/import`,
            {
                method: 'POST',
                body: formData,
            }
        );
    }

    return {
        createTemplate: createTemplate,
        getTemplates: getTemplates,
        getTemplate: getTemplate,
        getTemplateBpmnFile: getTemplateBpmnFile,
        saveTemplateBpmnFile: saveTemplateBpmnFile,
        publishTemplate: publishTemplate,
        editTemplate: editTemplate,
        analyze: analyze,
        importTemplate: importTemplate,
    };
}

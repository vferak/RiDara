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

    return {
        createTemplate: createTemplate,
    };
}

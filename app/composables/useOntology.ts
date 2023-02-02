import { AsyncData } from '#app';
import { OntologyFile } from '~/composables/types';

export const useOntology = () => {
    const workspaceUrlPrefix = '/ontology';

    const loadOntologyFile = async (name: string, file: File): Promise<AsyncData<OntologyFile, any>> => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        return useApiFetch<OntologyFile>(`${workspaceUrlPrefix}/loadFile`, {
            method: 'POST',
            body: formData
        });
    }

    const getOntologyFiles = async (): Promise<AsyncData<OntologyFile[], any>> => {
        return useApiFetch<OntologyFile[]>(`${workspaceUrlPrefix}/files`);
    }

    return {
        loadOntologyFile: loadOntologyFile,
        getOntologyFiles: getOntologyFiles,
    };
}

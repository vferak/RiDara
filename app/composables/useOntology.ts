import { AsyncData } from '#app';
import { OntologyFile, OntologyNode } from '~/composables/types';

export const useOntology = () => {
    const ontologyUrlPrefix = '/ontology';

    const loadOntologyFile = async (name: string, file: File): Promise<AsyncData<OntologyFile, any>> => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('file', file);

        return useApiFetch<OntologyFile>(`${ontologyUrlPrefix}/loadFile`, {
            method: 'POST',
            body: formData
        });
    }

    const getOntologyFiles = async (): Promise<AsyncData<OntologyFile[], any>> => {
        return useApiFetch<OntologyFile[]>(`${ontologyUrlPrefix}/files`);
    }

    const getOntologyNodes = async (ontologyFileUuid: string): Promise<AsyncData<OntologyNode[], any>> => {
        return useApiFetch<OntologyNode[]>(`${ontologyUrlPrefix}/${ontologyFileUuid}/nodes`);
    }

    const editOntologyFile = async (
        uuid: string,
        name: string
    ): Promise<AsyncData<OntologyFile, any>> => {
        const body = { name: name };

        return useApiFetch<OntologyFile>(
            `${ontologyUrlPrefix}/${uuid}`, {
                method: 'PATCH',
                body: body,
            }
        );
    }

    return {
        loadOntologyFile: loadOntologyFile,
        getOntologyFiles: getOntologyFiles,
        getOntologyNodes: getOntologyNodes,
        editOntologyFile: editOntologyFile,
    };
}

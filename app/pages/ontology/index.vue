<script setup lang='ts'>
import { OntologyFile } from '~/composables/types';

const {
    loadOntologyFile,
    getOntologyFiles,
    editOntologyFile,
    deleteOntologyFile,
} = useOntology();

const {
    modalState: importModalState,
    openModal: openImportModal,
    closeModal: closeImportModal
} = useModal('ontology-file');
const {
    modalState: editModalState,
    openModal: openEditModal,
    closeModal: closeEditModal
} = useModal('ontology-file-edit');

const { data: ontologyFiles, refresh: refreshFiles } = await getOntologyFiles();

const ontologyFileToEdit = useState<OntologyFile>();

const loadFile = async (name: string, file: File): Promise<void> => {
    await loadOntologyFile(name, file);
    await refreshFiles();
    closeImportModal();
};

const editModal = async (ontologyFile: OntologyFile): Promise<void> => {
    openEditModal();
    ontologyFileToEdit.value = ontologyFile;
}

const editFile = async (name: string): Promise<void> => {
    await editOntologyFile(ontologyFileToEdit.value.uuid, name);
    await refreshFiles();
    closeEditModal();
};

const deleteFile = async (ontologyFile: OntologyFile): Promise<void> => {
    const confirmed = confirm('Are you sure you want to delete this ontology file?');

    if (confirmed) {
        await deleteOntologyFile(ontologyFile.uuid);
        await refreshFiles();
    }
}
</script>

<template>
    <div>
        <LayoutGridList title='Ontology files'>
            <template v-slot:headerButtons>
                <button @click='openImportModal' class='btn btn-secondary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                    Import file
                </button>
            </template>

            <template v-slot:grid>
                <div v-for='ontologyFile in ontologyFiles' :key='ontologyFile.uuid'>
                    <CardPrimary class='hover:bg-primary' :title='ontologyFile.name'>
                        <p>Created at: <b>{{ new Date(ontologyFile.createDate).toLocaleDateString('cs') }}</b></p>
                        <template v-slot:actions>
                            <NuxtLink @click.prevent='editModal(ontologyFile)'>
                                <button class='btn btn-secondary btn-sm'>Edit</button>
                            </NuxtLink>
                            <NuxtLink @click.prevent='deleteFile(ontologyFile)'>
                                <button class='btn btn-secondary btn-sm'>Delete</button>
                            </NuxtLink>
                        </template>
                    </CardPrimary>
                </div>
            </template>
        </LayoutGridList>
        <Modal v-model='importModalState'>
            <h3 class='text-lg font-bold'>Import file</h3>
            <FormImportOntologyFile @form-sent='loadFile'/>
        </Modal>
        <Modal v-model='editModalState' v-if='editModalState'>
            <h3 class='text-lg font-bold'>Import file</h3>
            <FormImportOntologyFile @form-sent='editFile' :ontology-file='ontologyFileToEdit'/>
        </Modal>
    </div>
</template>

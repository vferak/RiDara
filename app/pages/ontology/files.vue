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
        <div class='container mx-auto'>
            <div class='flex items-center justify-between'>
                <p class='mb-4 mt-4 text-4xl font-bold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white'>
                    Ontology files</p>
                <div>
                    <button @click='openImportModal' class='btn btn-primary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                        Import file
                    </button>
                </div>
            </div>
            <div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
                <div v-for='ontologyFile in ontologyFiles' :key='ontologyFile.uuid'>
                    <div class='card w-50 bg-base-200 shadow-xl'>
                        <div class='card-body'>
                            <h2 class='card-title'>{{ ontologyFile.name }}</h2>
                            <p>Created at: <b>{{ new Date(ontologyFile.createDate).toLocaleDateString('cs') }}</b></p>
                            <div class='card-actions justify-end'>
                                <NuxtLink @click.prevent='editModal(ontologyFile)'>
                                    <button class='btn btn-secondary btn-sm'>Edit</button>
                                </NuxtLink>
                                <NuxtLink @click.prevent='deleteFile(ontologyFile)'>
                                    <button class='btn btn-error btn-sm'>Delete</button>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal v-model='importModalState'>
                <h3 class='text-lg font-bold'>Import file</h3>
                <FormImportOntologyFile @form-sent='loadFile'/>
            </Modal>
            <Modal v-model='editModalState' v-if='editModalState'>
                <h3 class='text-lg font-bold'>Import file</h3>
                <FormImportOntologyFile @form-sent='editFile' :ontology-file='ontologyFileToEdit'/>
            </Modal>
        </div>
    </div>
</template>

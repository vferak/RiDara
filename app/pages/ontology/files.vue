<script setup lang='ts'>
const { loadOntologyFile } = useOntology();
const { modalState, openModal, closeModal } = useModal('ontology-file');

const loadFile = async (name: string, file: File): Promise<void> => {
    await loadOntologyFile(name, file);
    closeModal();
};
</script>

<template>
    <div>
        <div class='container mx-auto'>
            <div class='flex items-center justify-between'>
                <p class='mb-4 mt-4 text-4xl font-bold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white'>
                    Ontology files</p>
                <div>
                    <button @click='openModal' class='btn mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                        Import file
                    </button>
                    <Modal v-model='modalState'>
                        <h3 class='text-lg font-bold'>Import file</h3>
                        <FormImportOntologyFile @form-sent='loadFile'/>
                    </Modal>
                </div>
            </div>
        </div>
    </div>
</template>

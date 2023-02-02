<script setup lang='ts'>
const { createTemplate } = useTemplate();
const { getOntologyFiles } = useOntology();
const { modalState, openModal, closeModal } = useModal('template-create');

const { data: ontologyFiles } = await getOntologyFiles();

const create = async (name: string, ontologyFileUuid: string): Promise<void> => {
    await createTemplate(name, ontologyFileUuid);
    closeModal();
};
</script>

<template>
    <div>
        <div class='container mx-auto my-6'>
            <div class='flex items-center justify-between'>
                <p class="mb-4 mt-4 text-4xl font-bold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white">
                    Templates
                </p>
                <div>
                    <button @click='openModal' class='btn btn-primary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                        New template
                    </button>
                </div>
            </div>
        </div>
        <Modal v-model='modalState'>
            <h3 class='text-lg font-bold'>Create new template</h3>
            <FormTemplate @form-sent='create' :ontology-files='ontologyFiles' />
        </Modal>
    </div>
</template>

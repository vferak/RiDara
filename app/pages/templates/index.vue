<script setup lang='ts'>
import { Template } from '~/composables/types';

const { createTemplate, editTemplate, getTemplates } = useTemplate();
const { getOntologyFiles } = useOntology();
const {
    modalState: createModalState,
    openModal: openCreateModal,
    closeModal: closeCreateModal
} = useModal('template-create');
const {
    modalState: editModalState,
    openModal: openEditModal,
    closeModal: closeEditModal
} = useModal('template-edit');

const { data: templates, refresh: refreshTemplates } = await getTemplates();
const templateToEdit = useState<Template>();
const { data: ontologyFiles } = await getOntologyFiles();

const exist = computed(() => templates.value !== null && templates.value?.length === 0);

const create = async (name: string, ontologyFileUuid: string): Promise<void> => {
    await createTemplate(name, ontologyFileUuid);
    await refreshTemplates();
    closeCreateModal();
};

const edit = async (name: string): Promise<void> => {
    await editTemplate(templateToEdit.value.uuid, name);
    await refreshTemplates();
    closeEditModal();
};

const editModal = async (template: Template): Promise<void> => {
    openEditModal();
    templateToEdit.value = template;
}
</script>

<template>
    <div>
        <div class='container mx-auto my-6'>
            <div class='flex items-center justify-between'>
                <p class="mb-4 mt-4 text-4xl font-bold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white">
                    Templates
                </p>
                <div>
                    <button @click='openCreateModal' class='btn btn-primary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                        New template
                    </button>
                </div>
            </div>
            <AlertInform v-if='exist' class='mb-6 mt-4'>No templates found! Go ahead and create one.</AlertInform>
            <div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
                <NuxtLink v-for='template in templates' :key='template.uuid' :to="{ name: 'templates-uuid', params: { uuid: template.uuid }}">
                    <div class='card w-50 bg-base-200 shadow-xl'>
                        <div class='card-body'>
                            <h2 class='card-title'>{{ template.name }}</h2>
                            <p>{{ template.ontologyFile.name }}</p>
                            <div class='card-actions justify-end'>
                                <NuxtLink @click.prevent='editModal(template)'>
                                    <button class='btn btn-sm'>Edit</button>
                                </NuxtLink>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>
        <Modal v-model='createModalState'>
            <h3 class='text-lg font-bold'>Create new template</h3>
            <FormTemplate @form-sent='create' :ontology-files='ontologyFiles' />
        </Modal>
        <Modal v-model='editModalState' v-if='editModalState'>
            <h3 class='text-lg font-bold'>Edit project</h3>
            <FormTemplate @form-sent='edit' :ontology-files='ontologyFiles' :template='templateToEdit' />
        </Modal>
    </div>
</template>

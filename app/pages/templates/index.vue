<script setup lang='ts'>
import { Template } from '~/composables/types';

const {
    createTemplate,
    editTemplate,
    getTemplates,
    importTemplate,
    deleteTemplate,
} = useTemplate();

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
const {
    modalState: importModalState,
    openModal: openImportModal,
    closeModal: closeImportModal
} = useModal('template-import');


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

const importTemplateSubmit = async (name: string, ontologyFileUuid: string, file: File): Promise<void> => {
    await importTemplate(name, ontologyFileUuid, file);

    await refreshTemplates();
    closeImportModal();
};

const removeTemplate = async (template: Template): Promise<void> => {
    const confirmed = confirm('Are you sure you want to delete this ontology file?');

    if (confirmed) {
        await deleteTemplate(template.uuid);
        await refreshTemplates();
    }
}
</script>

<template>
    <div>
        <LayoutGridList title='Templates'>
            <template v-slot:headerButtons>
                <button @click='openCreateModal' class='btn btn-secondary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                    New template
                </button>
                <button @click='openImportModal' class='btn btn-secondary ml-4 mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                    Import template
                </button>
            </template>

            <template v-slot:alerts>
                <AlertInform v-if='exist' class='mb-6 mt-4'>No templates found! Go ahead and create one.</AlertInform>
            </template>

            <template v-slot:grid>
                <NuxtLink v-for='template in templates' :key='template.uuid' :to="{ name: 'templates-uuid', params: { uuid: template.uuid }}">
                    <CardPrimary :title='template.name' :data-rows='[  ]' >
                        <p>{{ template.ontologyFile.name }}</p>
                        <template v-slot:actions>
                            <NuxtLink @click.prevent='editModal(template)'>
                                <button class='btn btn-secondary btn-sm'>Edit</button>
                            </NuxtLink>
                            <NuxtLink @click.prevent='removeTemplate(template)'>
                                <button class='btn btn-secondary btn-sm'>Delete</button>
                            </NuxtLink>
                        </template>
                    </CardPrimary>
                </NuxtLink>
            </template>
        </LayoutGridList>

        <Modal v-model='createModalState'>
            <h3 class='text-lg font-bold'>Create new template</h3>
            <FormTemplate @form-sent='create' :ontology-files='ontologyFiles' />
        </Modal>
        <Modal v-model='editModalState' v-if='editModalState'>
            <h3 class='text-lg font-bold'>Edit template</h3>
            <FormTemplate @form-sent='edit' :ontology-files='ontologyFiles' :template='templateToEdit' />
        </Modal>
        <Modal v-model='importModalState' v-if='importModalState'>
            <h3 class='text-lg font-bold'>Import template</h3>
            <FormTemplate @form-sent='importTemplateSubmit' :ontology-files='ontologyFiles' :is-import='true' />
        </Modal>
    </div>
</template>

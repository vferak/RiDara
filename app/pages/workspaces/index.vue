<script setup lang='ts'>
const { getWorkspaces, createWorkspace } = useWorkspace();
const { modalState, openModal, closeModal } = useModal('workspace-create');

const { data: workspaces, refresh: refreshWorkspaces } = await getWorkspaces();

const exist = computed(() => workspaces.value !== null && workspaces.value?.length === 0);

const create = async (name: string): Promise<void> => {
    await createWorkspace(name);
    await refreshWorkspaces();
    closeModal();
};
</script>

<template>
    <div>
        <LayoutGridList title='Workspaces'>
            <template v-slot:headerButtons>
                <button @click='openModal' class='btn btn-secondary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                    New workspace
                </button>
            </template>

            <template v-slot:alerts>
                <AlertInform v-if='exist' class='mb-6 mt-4'>Hi, it looks like you haven't created a workspace yet. You can create one here.</AlertInform>
            </template>

            <template v-slot:grid>
                <CardsWorkspaceCard v-for='workspace in workspaces' :key='workspace.uuid' :workspace='workspace' />
            </template>
        </LayoutGridList>

        <Modal v-model='modalState'>
            <h3 class='text-lg font-bold'>Create new workspace</h3>
            <FormWorkspace @form-sent='create'/>
        </Modal>
    </div>
</template>

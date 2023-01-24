<script setup lang='ts'>

const { getWorkspaces, createWorkspace } = useWorkspace();

let { data: workspaces, refresh } = await getWorkspaces();

const modalState = useState<boolean>(() => false);

const exist = computed(() => workspaces.value !== undefined && workspaces.value?.length === 0);

const openModal = () => {
    modalState.value = true;
};
const closeModal = () => {
    modalState.value = false;
};

const create = (name: string) => {
    createWorkspace(name);
    refresh();
    closeModal();
};

</script>

<template>
    <div>
        <div class='container mx-auto'>
            <div class='flex items-center justify-between'>
                <p class='mb-4 mt-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
                    Workspaces</p>
                <div>
                    <button @click='openModal' class='btn mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>New
                        workspace
                    </button>
                    <Modal v-model='modalState'>
                        <h3 class='text-lg font-bold'>Create new workspace</h3>
                        <FormWorkspace @form-sent='create'/>
                    </Modal>
                </div>
            </div>
            <AlertInform v-if='exist' class='mb-6 mt-4'>Please create workspace!</AlertInform>
            <div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
                <CardsWorkspaceCard v-for='workspace in workspaces' :key='workspace.uuid' :workspace='workspace' />
            </div>
        </div>

    </div>
</template>

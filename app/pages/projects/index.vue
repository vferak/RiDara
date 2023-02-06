<script setup lang='ts'>
const { getWorkspace } = useWorkspace();
const { getCurrentWorkspace } = useCurrentWorkspace();
const { getTemplates } = useTemplate();
const { getProjects, createProject } = useProject();
const { modalState, openModal, closeModal } = useModal('project-create');

const currentWorkspace = await getCurrentWorkspace();

const { data: projects, refresh: refreshProject } = await getProjects(currentWorkspace!.value!.uuid);
const {data: templates} = await getTemplates();

const { data: workspace } = await getWorkspace(currentWorkspace!.value!.uuid)

const create = async (name: string, templateUuid: string, blankFile: boolean): Promise<void> => {
    await createProject(name, workspace.value!, templateUuid, blankFile);
    await refreshProject();
    closeModal();
};
</script>

<template>
    <div>
        <div class='container mx-auto'>
            <div class='flex items-center justify-between'>
                <p class='mb-4 mt-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
                    Projects</p>
                <div>
                    <button @click='openModal' class='btn mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                        New project
                    </button>

                </div>
            </div>

            <div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
                <CardsProjectCard v-for='project in projects' :key='project.uuid' :project='project' />
            </div>
        </div>
        <Modal v-model='modalState'>
            <h3 class='text-lg font-bold'>Create new project</h3>
            <FormProject @form-sent='create' :templates='templates' />
        </Modal>

    </div>
</template>

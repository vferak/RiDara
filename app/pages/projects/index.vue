<script setup lang='ts'>
const { getWorkspace } = useWorkspace();
const { getCurrentWorkspace } = useCurrentWorkspace();
const { getTemplates } = useTemplate();
const { getProjects, createProject, importProject } = useProject();

const { modalState: createState, openModal: createOpen, closeModal: createClose } = useModal('project-create');
const { modalState: importState , openModal: importOpen, closeModal: importClose } = useModal('project-import');

const currentWorkspace = await getCurrentWorkspace();

const { data: projects, refresh: refreshProject } = await getProjects(currentWorkspace!.value!.uuid);
const {data: templates} = await getTemplates();

const { data: workspace } = await getWorkspace(currentWorkspace!.value!.uuid)

const create = async (name: string, templateUuid: string, blankFile: boolean): Promise<void> => {
    await createProject(name, workspace.value!, templateUuid, blankFile);
    await refreshProject();
    createClose();
};

const upload = async (name: string, file: File, templateUuid: string): Promise<void> => {
    await importProject(name, workspace.value!.uuid, file, templateUuid);
    await refreshProject();
    importClose();
};
</script>

<template>
    <div>
        <div class='container mx-auto'>
            <div class='flex items-center justify-between'>
                <p class='mb-4 mt-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
                    Projects</p>
                <div>
                    <button @click='createOpen' class='btn mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                        New project
                    </button>

                    <button @click='importOpen' class='btn ml-4 mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                        Import project
                    </button>
                </div>
            </div>

            <div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
                <CardsProjectCard v-for='project in projects' :key='project.uuid' :project='project' />
            </div>
        </div>
        <Modal v-model='createState'>
            <h3 class='text-lg font-bold'>Create new project</h3>
            <FormProject @form-sent='create' :templates='templates' />
        </Modal>

        <Modal v-model='importState'>
            <h3 class='text-lg font-bold'>Import project</h3>
            <ImportProjectFile @form-sent='upload' :templates='templates' />
        </Modal>

    </div>
</template>

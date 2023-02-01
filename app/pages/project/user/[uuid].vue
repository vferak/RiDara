<script setup lang='ts'>
import { User, Workspace } from '~/composables/types';

const route = useRoute();

const { getProjects, createProject } = useProject();
const { modalState, openModal, closeModal } = useModal('project-create');
const uuid = route.params.uuid.toString();

const { data: projects, refresh: refreshProject } = await getProjects(uuid);

const { getUserProfile } = useUser();

const {data: user} = await getUserProfile();

const userData: User = {
    email: user.value?.email,
    password: user.value?.password,
    uuid: user.value?.uuid,
    userWorkspaces: user.value?.userWorkspaces
}

let workspace: Workspace = {
uuid:'316e1b5f-ca7d-4c6f-8145-82493b4ab3a5',name:'Kokot',owner: userData,
}

const create = async (name: string): Promise<void> => {
    await createProject(name, workspace);
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
            <FormProject @form-sent='create'/>
        </Modal>

    </div>
</template>

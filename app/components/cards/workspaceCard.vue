<script setup lang='ts'>
import { Workspace } from '~/composables/types';

const { setCurrentWorkspace } = useCurrentWorkspace();
const { getProjects} = useProject();

const { workspace } = defineProps<{ workspace: Workspace }>();
const { data: projects } = await getProjects(workspace.uuid);

const setWorkspace = (): void => {
    setCurrentWorkspace(workspace.uuid);
}
</script>

<template>
    <div>
        <NuxtLink @click='setWorkspace' to="projects">
            <div class='card w-50 bg-base-200 shadow-xl'>
                <div class='card-body'>
                    <h2 class='card-title'>{{ workspace.name }}</h2>
                    <p>{{ workspace.owner.firstName }} {{ workspace.owner.lastName }}</p>
                    <p>Projects: {{ projects.length }}</p>
                    <div class='card-actions justify-end'>
                        <NuxtLink :to="{ name: 'workspaces-uuid-settings', params: { uuid: workspace.uuid }}">
                            <button class='btn btn-sm'>Edit</button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>


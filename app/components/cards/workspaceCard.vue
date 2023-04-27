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
            <CardPrimary :title='workspace.name'>
                <p>{{ workspace.owner.firstName }} {{ workspace.owner.lastName }}</p>
                <p>Projects: {{ projects.length }}</p>

                <template v-slot:actions>
                    <NuxtLink :to="{ name: 'workspace-uuid-settings', params: { uuid: workspace.uuid }}">
                        <button class='btn btn-secondary btn-sm'>Edit</button>
                    </NuxtLink>
                </template>
            </CardPrimary>
        </NuxtLink>
    </div>
</template>


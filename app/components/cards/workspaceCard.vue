<script setup lang='ts'>
import { Workspace } from '~/composables/types';

const { setCurrentWorkspace } = useCurrentWorkspace();

const { workspace } = defineProps<{ workspace: Workspace }>();

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
                    <p>Projects: 8</p>
<!--                    <div class='card-actions justify-end'>-->
<!--                        <button class='btn btn-primary'>Open</button>-->
<!--                    </div>-->
                </div>
            </div>
        </NuxtLink>
    </div>
</template>


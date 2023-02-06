<script setup lang='ts'>
import { Project } from '~/composables/types';

const { project } = defineProps<{ project: Project }>();
</script>

<template>
    <div>
        <NuxtLink :to="{ name: 'projects-uuid', params: { uuid: project.uuid }}">
            <div class='card w-50 bg-base-200 shadow-xl'>
                <div class='card-body'>
                    <h2 class='card-title'>{{ project.name }}</h2>
                    <p>{{ project.owner.firstName }} {{ project.owner.lastName }}</p>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>


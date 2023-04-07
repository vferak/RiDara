<script setup lang='ts'>
import { Project } from '~/composables/types';

const { project } = defineProps<{
    project: Project,
}>();

const emit = defineEmits<{
    (event: 'editProject', project: Project): void;
    (event: 'deleteProject', project: Project): void;
}>();

const editOpen = async (project: Project): Promise<void> => {
    emit('editProject', project);
};

const projectDelete = async (project: Project): Promise<void> => {
    emit('deleteProject', project);
}

</script>

<template>
    <div>
        <NuxtLink :to="{ name: 'projects-uuid', params: { uuid: project.uuid }}">
            <div class='card w-50 bg-base-200 shadow-xl'>
                <div class='card-body'>
                    <h2 class='card-title'>{{ project.name }}</h2>
                    <p>Owner: <b>{{ project.owner.firstName }} {{ project.owner.lastName }}</b></p>
                    <p>Template: <b>{{ project.template.name }}</b></p>
                    <div class='card-actions justify-end'>
                        <NuxtLink @click.prevent='editOpen(project)'>
                            <button class='btn btn-sm'>Edit</button>
                        </NuxtLink>

                        <NuxtLink @click.prevent='projectDelete(project)'>
                            <button class='btn btn-sm'>Delete</button>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </NuxtLink>
    </div>
</template>


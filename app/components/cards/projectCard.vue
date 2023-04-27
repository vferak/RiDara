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
            <CardPrimary :title='project.name'>
                <p>Owner: <b>{{ project.owner.firstName }} {{ project.owner.lastName }}</b></p>
                <p>Template: <b>{{ project.templateVersion.template.name }}</b></p>

                <template v-slot:actions>
                    <NuxtLink @click.prevent='editOpen(project)'>
                        <button class='btn btn-secondary btn-sm'>Edit</button>
                    </NuxtLink>

                    <NuxtLink @click.prevent='projectDelete(project)'>
                        <button class='btn btn-secondary btn-sm'>Delete</button>
                    </NuxtLink>
                </template>
            </CardPrimary>
        </NuxtLink>
    </div>
</template>


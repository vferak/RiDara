<script setup lang='ts'>
import { OntologyFile, Workspace } from '~/composables/types';

const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    templates: OntologyFile[],
    workspaces: Workspace[],
    name: string,
    templateUuid: string,
    workspaceUuid: string,
    templateName: string,
}>();

const emit = defineEmits<{
    (event: 'formSent', name: string, workspaceUuid: string, templateUuid: string): void
}>();

const templates = props.templates.map((template) => {
    return {
        value: template.uuid,
        name: template.name,
        disabled: false
    }
});

const workspaces = props.workspaces.map((workspace) => {
    return {
        value: workspace.uuid,
        name: workspace.name,
        disabled: false
    }
});

templates.unshift({ value: '', name: 'Select template', disabled: true });
workspaces.unshift({ value: '', name: 'Select workspace', disabled: true });

const { handleSubmit, resetForm } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            name: $z.string().min(4, { message: 'Too short' }),
            templateUuid: $z.string().refine((value) => value !== '' && templates.some(
                (templates) => templates.value === value
            ), {message: 'Selected invalid template'}),
            workspaceUuid: $z.string().refine((value) => value !== '' && workspaces.some(
                (workspaces) => workspaces.value === value
            ), {message: 'Selected invalid workspace'}),
        })
    ),
});

const name = $veeValidate.useField<string>('name');
const templateUuid = $veeValidate.useField<string>('templateUuid');
const workspaceUuid = $veeValidate.useField<string>('workspaceUuid');
name.setValue(props.name);
templateUuid.setValue(props.templateUuid);
workspaceUuid.setValue(props.workspaceUuid);

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', name.value.value, workspaceUuid.value.value, templateUuid.value.value);
    resetForm();
    templateUuid.setValue('');
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <FormInputBase :name='"File"' :type='"select"' :field='templateUuid' :options='templates'/>
        <FormInputBase :name='"Workspace"' :type='"select"' :field='workspaceUuid' :options='workspaces'/>
        <input type='submit' value='Submit' class='btn btn-sm mt-4'/>
    </form>
</template>

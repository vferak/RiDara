<script setup lang='ts'>
import { OntologyFile } from '~/composables/types';

const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    templates: OntologyFile[]
}>();

const emit = defineEmits<{
    (event: 'formSent', name: string, templateUuid: string): void
}>();

const templates = props.templates.map((template) => {
    return {
        value: template.uuid,
        name: template.name,
        disabled: false
    }
});
templates.unshift({ value: '', name: 'Select template', disabled: true });


const { handleSubmit, resetForm } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            name: $z.string().min(4, { message: 'Too short' }),
            templateUuid: $z.string().refine((value) => value !== '' && templates.some(
                (templates) => templates.value === value
            ), {message: 'Selected invalid template'}),
        })
    ),
});

const name = $veeValidate.useField<string>('name');
const templateUuid = $veeValidate.useField<string>('templateUuid');
templateUuid.setValue('');

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', name.value.value, templateUuid.value.value);
    resetForm();
    templateUuid.setValue('');
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <FormInputBase :name='"File"' :type='"select"' :field='templateUuid' :options='templates'/>
        <input type='submit' value='Submit' class='btn btn-sm mt-4'/>
    </form>
</template>

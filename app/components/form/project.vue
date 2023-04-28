<script setup lang='ts'>
import { Template } from '~/composables/types';

const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    templates: Template[]
}>();

const emit = defineEmits<{
    (event: 'formSent', name: string, templateUuid: string, blankFile: boolean): void
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
            blankFile: $z.string(),
        })
    ),
});

const name = $veeValidate.useField<string>('name');
const templateUuid = $veeValidate.useField<string>('templateUuid');
templateUuid.setValue('');

const blankFile = $veeValidate.useField<string>('blankFile');
blankFile.setValue('no');

const onSubmit = handleSubmit(async (): Promise<void> => {
    const blankFileValue = blankFile.value.value === "yes";
    emit('formSent', name.value.value, templateUuid.value.value, blankFileValue);
    resetForm();
    templateUuid.setValue('');
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <FormInputBase :name='"Template"' :type='"select"' :field='templateUuid' :options='templates'/>
        <FormInputBase :name='"Blank file"' :type='"radio"' :field='blankFile'/>
        <input type='submit' value='Submit' class='btn btn-primary btn-sm mt-4'/>
    </form>
</template>

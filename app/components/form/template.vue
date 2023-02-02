<script setup lang='ts'>
import { OntologyFile } from '~/composables/types';

const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    ontologyFiles: OntologyFile[]
}>();

const emit = defineEmits<{
    (event: 'formSent', name: string, ontologyFileUuid: string): void
}>();

const ontologySelectOptions = props.ontologyFiles.map((ontologyFile) => {
    return {
        value: ontologyFile.uuid,
        name: ontologyFile.name,
        disabled: false
    }
});
ontologySelectOptions.unshift({ value: '', name: 'Select ontology file', disabled: true });


const { handleSubmit, resetForm } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            name: $z.string().min(4, { message: 'Too short' }),
            ontologyFileUuid: $z.string().refine((value) => value !== '' && ontologySelectOptions.some(
                (ontologySelectOption) => ontologySelectOption.value === value
            ), {message: 'Selected invalid ontology file'}),
        })
    ),
});

const name = $veeValidate.useField<string>('name');
const ontologyFileUuid = $veeValidate.useField<string>('ontologyFileUuid');
ontologyFileUuid.setValue('');

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', name.value.value, ontologyFileUuid.value.value);
    resetForm();
    ontologyFileUuid.setValue('');
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <FormInputBase :name='"Ontology file"' :type='"select"' :field='ontologyFileUuid' :options='ontologySelectOptions'/>
        <input type='submit' value='Submit' class='btn btn-sm mt-4'/>
    </form>
</template>

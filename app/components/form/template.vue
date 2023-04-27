<script setup lang='ts'>
import { OntologyFile, Template } from '~/composables/types';

const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    ontologyFiles: OntologyFile[],
    template?: Template,
    isImport?: boolean,
}>();

const emit = defineEmits<{
    (event: 'formSent', name: string, ontologyFileUuid: string, file?: File): void
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
            file: $z
                .any()
                .refine(
                    () => !isImport || fileData.value?.name.split('.').pop() === "bpmn",
                    "Only .bpmn file is supported."
                )
        })
    ),
});

const fileData = useState<File>();
const isImport = props.isImport !== undefined && props.isImport;

const name = $veeValidate.useField<string>('name');
const ontologyFileUuid = $veeValidate.useField<string>('ontologyFileUuid');
const file = $veeValidate.useField<string>('file');

ontologyFileUuid.setValue('');

if (props.template !== undefined) {
    name.setValue(props.template.name);
    ontologyFileUuid.setValue(props.template.ontologyFile.uuid);
}

const onChangeFile = (event: any) => {
    const eventFiles = event.target.files;
    if (eventFiles.length !== 0) {
        fileData.value = eventFiles[0];
    }
}

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', name.value.value, ontologyFileUuid.value.value, fileData.value);
    resetForm();
    ontologyFileUuid.setValue('');
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <FormInputBase
            v-if='props.template === undefined'
            :name='"Ontology file"' :type='"select"'
            :field='ontologyFileUuid'
            :options='ontologySelectOptions'
        />
        <FormInputBase v-if='isImport' @change='onChangeFile($event)' :name='"Template file"' :type='"file"' :field='file'/>
        <input type='submit' value='Submit' class='btn btn-primary btn-sm mt-4'/>
    </form>
</template>

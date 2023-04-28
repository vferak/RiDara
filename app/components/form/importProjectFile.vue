<script setup lang='ts'>
import { OntologyFile } from '~/composables/types';

const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    templates: OntologyFile[]
}>();

const emit = defineEmits<{
    (event: 'formSent', name: string, file: File, templateUuid: string): void
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
            file: $z
                .any()
                .refine(
                    () => fileData.value?.name.split('.').pop() === "bpmn",
                    "Only .bpmn file is supported."
                )
        })
    ),
});

const name = $veeValidate.useField<string>('name');
const file = $veeValidate.useField<string>('file');
const templateUuid = $veeValidate.useField<string>('templateUuid');
templateUuid.setValue('');

const fileData = useState<File>();

const onChangeFile = (event: any) => {
    const eventFiles = event.target.files;
    if (eventFiles.length !== 0) {
        fileData.value = eventFiles[0];
    }
}

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', name.value.value, fileData.value, templateUuid.value.value);
    resetForm();
    templateUuid.setValue('');
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4' method="post" enctype="multipart/form-data">
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <FormInputBase @change='onChangeFile($event)' :name='"Project file"' :type='"file"' :field='file'/>
        <FormInputBase :name='"Template"' :type='"select"' :field='templateUuid' :options='templates'/>
        <input type='submit' value='Submit' class='btn btn-primary btn-sm mt-4'/>
    </form>
</template>

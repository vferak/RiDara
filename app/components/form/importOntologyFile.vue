<script setup lang='ts'>
const { $z, $veeValidate } = useNuxtApp();

const emit = defineEmits<{
    (event: 'formSent', name: string, file: File): void
}>();

const { handleSubmit } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            name: $z.string().min(4, { message: 'Too short' }),
            file: $z
                .any()
                .refine(
                    () => ['text/turtle'].includes(fileData.value?.type),
                    "Only .ttl file is supported."
                )
        })
    ),
});

const name = $veeValidate.useField<string>('name');
const file = $veeValidate.useField<string>('file');

const fileData = useState<File>();

const onChangeFile = (event: any) => {
    const eventFiles = event.target.files;
    if (eventFiles.length !== 0) {
        fileData.value = eventFiles[0];
    }
}

const onSubmit = handleSubmit(async (): Promise<void> => {
    emit('formSent', name.value.value, fileData.value);
    name.resetField();
    file.resetField();
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4' method="post" enctype="multipart/form-data">
        <FormInputBase :name='"Name"' :type='"text"' :field='name'/>
        <FormInputBase @change='onChangeFile($event)' :name='"Ontology file"' :type='"file"' :field='file'/>
        <input type='submit' value='Submit' class='btn btn-sm mt-4'/>
    </form>
</template>

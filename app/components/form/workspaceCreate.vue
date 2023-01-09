<script setup lang='ts'>

const router = useRouter();
const workspace = useWorkspace();
const { $z, $veeValidate } = useNuxtApp();

const emit = defineEmits<{
    (event: 'formSent', value: boolean): void
}>();

const { handleSubmit } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            name: $z.string().min(4, { message: 'Too short' }),
        })
    ),
});

const name = $veeValidate.useField<string>('name');

const onSubmit = handleSubmit(async (): Promise<void> => {
    await workspace.create(name.value.value);
    emit('formSent', true);
});

</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"Name"' :type='"text"' :field='name'  />
        <input type='submit' value='Submit' class='btn btn-sm mt-4' />
    </form>
</template>

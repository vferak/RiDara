<script setup lang='ts'>
const { push } = useRouter();
const { logOut } = useAuth();
const { updateUser } = useUser();
const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    firstName: string,
    lastName: string,
}>();


const { handleSubmit } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            firstName: $z.string(),
            lastName: $z.string(),
        }),
    ),
});

const firstName = $veeValidate.useField<string>('firstName');
const lastName = $veeValidate.useField<string>('lastName');

firstName.setValue(props.firstName);
lastName.setValue(props.lastName);

const onSubmit = handleSubmit(async (): Promise<void> => {
    await updateUser(firstName.value.value, lastName.value.value);
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"First name"' :type='"text"' :field='firstName' />
        <FormInputBase :name='"Last name"' :type='"text"' :field='lastName' />
        <input type='submit' value='Submit' class='btn btn-primary btn-sm mt-4' />
    </form>
</template>

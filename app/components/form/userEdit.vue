<script setup lang='ts'>
const { push } = useRouter();
const { logOut } = useAuth();
const { updateUser } = useUser();
const { $z, $veeValidate } = useNuxtApp();

const props = defineProps<{
    firstName: string,
    lastName: string,
    userEmail: string
}>();


const { handleSubmit } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            email: $z.string().email({ message: 'Must be a valid email' }),
            firstName: $z.string(),
            lastName: $z.string(),
        }),
    ),
});

const firstName = $veeValidate.useField<string>('firstName');
const lastName = $veeValidate.useField<string>('lastName');
const email = $veeValidate.useField<string>('email');

firstName.setValue(props.firstName);
lastName.setValue(props.lastName);
email.setValue(props.userEmail);

const onSubmit = handleSubmit(async (): Promise<void> => {
    await updateUser(email.value.value, firstName.value.value, lastName.value.value);
    logOut();
    push("/");
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"First name"' :type='"text"' :field='firstName' />
        <FormInputBase :name='"Last name"' :type='"text"' :field='lastName' />
        <FormInputBase :name='"E-mail"' :type='"email"' :field='email'  />
        <input type='submit' value='Submit' class='btn btn-sm mt-4' />
    </form>
</template>

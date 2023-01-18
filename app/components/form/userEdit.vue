<script setup lang='ts'>

const router = useRouter();
const auth = useAuth();
const user = useUser();
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
            password: $z.string().min(3, { message: 'Too short' }),
            password_again: $z.string().min(3, { message: 'Too short' }),
        }).superRefine(({ password_again, password }, ctx) => {
            if (password_again !== password) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'The passwords did not match',
                    path: ['password_again'],
                });
            }
        }),
    ),
});

const firstName = $veeValidate.useField<string>('firstName');
const lastName = $veeValidate.useField<string>('lastName');
const email = $veeValidate.useField<string>('email');

firstName.setValue(props.firstName);
lastName.setValue(props.lastName);
email.setValue(props.userEmail);


const password = $veeValidate.useField<string>('password');
const password_again = $veeValidate.useField<string>('password_again');

const onSubmit = handleSubmit(async (): Promise<void> => {
    await user.update(email.value.value, firstName.value.value, lastName.value.value, password.value.value);
    auth.logOut();
    router.push("/");

});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"First name"' :type='"text"' :field='firstName' />
        <FormInputBase :name='"Last name"' :type='"text"' :field='lastName' />
        <FormInputBase :name='"E-mail"' :type='"email"' :field='email'  />
        <FormInputBase :name='"New password"' :type='"password"' :field='password'/>
        <FormInputBase :name='"New password again"' :type='"password"' :field='password_again'/>
        <input type='submit' value='Submit' class='btn btn-sm mt-4' />
    </form>
</template>

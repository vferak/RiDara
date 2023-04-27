<script setup lang='ts'>
const { push } = useRouter();
const { logOut } = useAuth();
const { updateUserPassword } = useUser();
const { $z, $veeValidate } = useNuxtApp();

const { handleSubmit } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
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

const password = $veeValidate.useField<string>('password');
const password_again = $veeValidate.useField<string>('password_again');

const onSubmit = handleSubmit(async (): Promise<void> => {
    await updateUserPassword(password.value.value);
    logOut();
    push("/");
});
</script>

<template>
    <form @submit='onSubmit' class='flex flex-col mb-4'>
        <FormInputBase :name='"New password"' :type='"password"' :field='password'/>
        <FormInputBase :name='"New password again"' :type='"password"' :field='password_again'/>
        <input type='submit' value='Submit' class='btn btn-primary btn-sm mt-4' />
    </form>
</template>

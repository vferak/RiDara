<script setup lang='ts'>

const router = useRouter();
const { registerUser } = useUser();
const { $z, $veeValidate } = useNuxtApp();
const fail = useState<boolean>();

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

const email = $veeValidate.useField<string>('email');
const firstName = $veeValidate.useField<string>('firstName');
const lastName = $veeValidate.useField<string>('lastName');
const password = $veeValidate.useField<string>('password');
const password_again = $veeValidate.useField<string>('password_again');

const onSubmit = handleSubmit(async (): Promise<void> => {
    const {data: register} = await registerUser(email.value.value, firstName.value.value, lastName.value.value, password.value.value);
    const registration = JSON.parse(register.value!);
    if (registration) {
        router.push({ path: '/', query: {'registration_successful': JSON.parse(register.value!) ? 1 : 0 } });
    } else {
        fail.value = true;
    }
});
</script>
<template>
    <Toast v-model='fail'>
        <AlertError>User with this email already exists</AlertError>
    </Toast>
    <form @submit='onSubmit' class='flex flex-col'>
        <FormInputBase :name='"First name"' :type='"text"' :field='firstName' />
        <FormInputBase :name='"Last name"' :type='"text"' :field='lastName' />
        <FormInputBase :name='"E-mail"' :type='"email"' :field='email' />
        <FormInputBase :name='"Password"' :type='"password"' :field='password' />
        <FormInputBase :name='"Password again"' :type='"password"' :field='password_again' />
        <input type='submit' value='Submit' class='btn btn-sm mt-4' />
    </form>
</template>

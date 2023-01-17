<script setup lang='ts'>
const router = useRouter();
const auth = useAuth();
const { $z, $veeValidate } = useNuxtApp();

const { handleSubmit } = $veeValidate.useForm({
    validationSchema: $veeValidate.toFormValidator(
        $z.object({
            email: $z.string().email({ message: 'Must be a valid email' }),
            password: $z.string().min(3, { message: 'Too short' }),
        }),
    )
});

const email = $veeValidate.useField<string>('email');
const password = $veeValidate.useField<string>('password');

const loginFailed = useState<boolean>(() => false);

const onSubmit = handleSubmit(async (): Promise<void> => {
    try {
        await auth.logIn(email.value.value, password.value.value);
        router.push('/templates');
    } catch {
        loginFailed.value = true;
    }
});
</script>
<template>
    <form @submit='onSubmit' class='flex flex-col'>
        <AlertError v-if='loginFailed' class='mb-6 mt-4'>Invalid credentials!</AlertError>
        <FormInputBase :name='"E-mail"' :type='"email"' :field='email'/>
        <FormInputBase :name='"Password"' :type='"password"' :field='password'/>
        <input type='submit' value='Submit' class='btn btn-sm mt-4' />
    </form>
</template>

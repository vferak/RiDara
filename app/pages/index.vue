<script setup lang='ts'>
useHead({
    title: useTitle().createTitle('Login'),
});

const route = useRoute();
const success = useState<boolean>(() => false);
const fail = useState<boolean>(() => false);

watchEffect(() => {
    if (route.query.registration_successful === '1')
    {
        fail.value = false;
        success.value = true;
    }
    if (route.query.registration_successful === '0')
    {
        success.value = false;
        fail.value = true;
    }
});
</script>
<template>
    <div class='container mx-auto h-full'>
        <Toast v-model='success'>
            <AlertSuccess>Registration successful</AlertSuccess>
        </Toast>
        <Toast v-model='fail'>
            <AlertError>User with this email already exists</AlertError>
        </Toast>
        <div class='flex h-full justify-center items-center'>
            <div class='card bg-base-100 shadow-xl w-1/3 mb-48'>
                <div class='card-body w-full'>
                    <div class='flex item-center justify-between'>
                        <h2 class='card-title'>Login</h2>
                        <NuxtLink to='/register' class='btn btn-secondary sm:btn-md text-end space-between'>Create account</NuxtLink>
                    </div>
                    <FormLogin />
                </div>
            </div>
        </div>
    </div>
</template>

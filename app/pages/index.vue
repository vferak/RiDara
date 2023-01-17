<script setup lang='ts'>
const route = useRoute();
const success = useState<boolean>();

watchEffect(() => {
   success.value = !!(route.query.registration_successful);
});
</script>
<template>
    <div class='container mx-auto h-full'>
        <Toast v-model='success'>
            <AlertSuccess>Registration successful</AlertSuccess>
        </Toast>
        <div class='flex h-full justify-center items-center'>
            <div class='card bg-base-100 shadow-xl w-1/3 mb-48'>
                <div class='card-body w-full'>
                    <div class='flex item-center justify-between'>
                        <h2 class='card-title'>Login</h2>
                        <NuxtLink to='/register' class='btn sm:btn-md text-end space-between'>Create account</NuxtLink>
                    </div>
                    <FormLogin />
                </div>
            </div>
        </div>
    </div>
</template>

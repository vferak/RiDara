<script setup lang='ts'>
const route = useRoute();
const success = useState(() => !!(route.query.registration_succesfull));
watchEffect(() => {
    success.value = !!(route.query.registration_succesfull);
})

if (success.value) {
    setTimeout(() => {
        success.value = false;
    }, 5000);
}

</script>
<template>
    <div class='container mx-auto h-full'>
        <ToastSuccess v-show='success'>Registration successfull</ToastSuccess>
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

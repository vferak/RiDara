<script setup lang='ts'>
useHead({
    title: useTitle().createTitle('Registration'),
});
</script>
<template>
    <div class='container mx-auto h-full'>
        <div class='flex h-full justify-center items-center'>
            <div class='card bg-base-100 shadow-xl w-1/3 mb-48'>
                <div class='card-body w-full'>
                    <div class='flex item-center justify-between'>
                        <h2 class='card-title'>New account</h2>
                    </div>
                    <FormRegister/>
                </div>
            </div>
        </div>
    </div>
</template>

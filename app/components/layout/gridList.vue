<script setup lang='ts'>
const props = defineProps<{
    title: string,
}>();
</script>

<template>
    <div class='container mx-auto my-6'>
        <div class='flex items-center justify-between mb-4'>
            <p class="mb-4 mt-4 text-4xl font-bold tracking-tight leading-none md:text-5xl lg:text-6xl dark:text-white">
                {{ props.title }}
            </p>
            <div>
                <slot name='headerButtons' />
            </div>
        </div>

        <div class='mb-8'>
            <slot name='alerts' />
        </div>

        <div class='grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5'>
            <slot name='grid' />
        </div>
    </div>
</template>

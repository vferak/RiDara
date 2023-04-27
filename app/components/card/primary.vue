<script setup lang='ts'>

const props = defineProps<{
    title: string,
}>();

</script>

<template>
    <div class='card bg-primary hover:bg-primary-focus text-primary-content w-50 bg-base-200 shadow-xl'>
        <div class='card-body'>
            <h2 class='card-title'>{{ props.title }}</h2>

            <slot />

            <div class='card-actions justify-end'>
                <slot name='actions' />
            </div>
        </div>
    </div>
</template>

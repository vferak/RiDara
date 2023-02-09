<script setup lang='ts'>
const props = defineProps<{
    modelValue: boolean
}>();

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
}>();
</script>
<template>
    <div v-show='props.modelValue' class='modal left-80 visible opacity-100 pointer-events-auto' @click="emit('update:modelValue', false)">
        <div class='modal-box relative' @click.stop>
            <slot/>
        </div>
    </div>
</template>

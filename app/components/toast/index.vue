<script setup lang='ts'>
const props = defineProps<{
    modelValue: boolean
}>();

const emit = defineEmits<{
    (event: 'update:modelValue', value: boolean): void
}>();

watchEffect(() => {
    if (props.modelValue) {
        setTimeout(() => {
            emit('update:modelValue', false);
        }, 3 * 1000);
    }
});
</script>
<template>
    <Transition enter-active-class='duration-300 ease-out opacity-0 scale-90'
                enter-to-class='opacity-100 scale-100'
                leave-active-class='duration-200 ease-in'
                leave-to-class='opacity-0 scale-90'>
        <div v-if='props.modelValue' class='toast toast-top toast-end mt-20'>
            <slot />
        </div>
    </Transition>
</template>

<script setup lang='ts'>

const props = defineProps<{
    modelValue: boolean
}>();

watch(() => props.modelValue, () => {});

</script>
<template>
    <input v-model='props.modelValue' type='checkbox' id='new-template' class='modal-toggle' />
    <label for='new-template' class='modal cursor-pointer'>
        <label class='modal-box relative' for=''>
            <slot/>
        </label>
    </label>
</template>

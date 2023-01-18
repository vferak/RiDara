<script setup lang='ts'>
useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light'
});

const mounted = useState<boolean>(() => false);

onBeforeMount(() => {
    watchEffect(() => {
        mounted.value = !!(document.documentElement.dataset.theme)
    })
})

</script>
<template>
    <div v-show='mounted'>
        <slot/>
    </div>
</template>

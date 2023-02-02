<script setup lang='ts'>
const { $bpmnModeler } = useNuxtApp();

const props = defineProps<{
    xml: string
}>();

const emit = defineEmits<{
    (event: 'save-bpmn', xml: string): void
}>();

onMounted(async () => {
    $bpmnModeler.init('#canvas', '#properties')
    try {
        await $bpmnModeler.get().importXML(props.xml);
    } catch (err) {
        console.log('error rendering', err);
    }
});

onUnmounted(() => {
    $bpmnModeler.destroy();
})

const saveDiagram = async () => {
    const xml = await $bpmnModeler.get().saveXML();
    emit('save-bpmn', xml.xml);
}
</script>

<template>
    <div class='h-full w-full bg-white'>
        <div class="modeler grid grid-cols-4 h-full">
            <div id="canvas" class='col-span-3'></div>
            <div id="properties" class='border-l-4'></div>
        </div>
        <div @click='saveDiagram' class='fixed bottom-10'>Save</div>
    </div>
</template>

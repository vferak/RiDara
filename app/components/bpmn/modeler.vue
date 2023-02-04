<script setup lang='ts'>
import { SelectOption } from '~/plugins/bpmn';
const { $bpmnModeler } = useNuxtApp();

const props = defineProps<{
    xml: string,
    upmmOptions: SelectOption[]
}>();

const emit = defineEmits<{
    (event: 'save-bpmn', xml: string): void
}>();

const saveKeyListener = (event: { ctrlKey: any; metaKey: any; code: string; preventDefault: () => void; }) => {
    if (!(event.ctrlKey || event.metaKey) || event.code !== 'KeyS') {
        return;
    }

    event.preventDefault();
    saveDiagram();
};

onMounted(async () => {
    $bpmnModeler.init('#canvas', '#properties', props.upmmOptions);

    try {
        await $bpmnModeler.get().importXML(props.xml);
    } catch (err) {
        console.log('error rendering', err);
    }

    document.addEventListener('keydown', saveKeyListener);
});

onUnmounted(() => {
    document.removeEventListener('keydown', saveKeyListener);

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

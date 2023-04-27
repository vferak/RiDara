<script setup lang='ts'>
import { SelectOption } from '~/plugins/bpmn';
const { $bpmnModeler } = useNuxtApp();

const props = defineProps<{
    xml: string,
    upmmOptions: SelectOption[],
    isTemplate: boolean
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
    $bpmnModeler.init('#canvas', '#properties', props.upmmOptions, props.isTemplate);

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

const downloadSVG = async () => {
    const svg = await $bpmnModeler.get().saveSVG();
    const blob = new Blob([svg.svg], { type: 'XML' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
}

const downloadBPMN = async () => {
    const xml = await $bpmnModeler.get().saveXML();
    const blob = new Blob([xml.xml], { type: 'XML' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = 'diagram.bpmn';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
}

</script>

<template>
    <div class='h-full w-full bg-white'>
        <div class="modeler grid grid-cols-4 h-full">
            <div id="canvas" class='col-span-3'></div>
            <div id="properties" class='border-l-4'></div>
        </div>
        <div class="flex justify-between fixed bottom-14 items-center ml-2 z-50">
            <div class="dropdown dropdown-top m-0">
                <label tabindex="0" class="btn m-1">Download</label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52">
                    <li @click='downloadBPMN'><a>BPMN</a></li>
                    <li @click='downloadSVG'><a>SVG</a></li>
                </ul>
            </div>
            <button @click='saveDiagram' class="btn btn-success">Save</button>
        </div>
    </div>
</template>

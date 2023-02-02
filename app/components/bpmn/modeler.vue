<script setup lang='ts'>
// @ts-ignore
import Modeler from 'bpmn-js/lib/Modeler';
// @ts-ignore
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel';

const props = defineProps<{
    xml: string
}>();

let modeler: Modeler;

onMounted(async () => {
    modeler = new Modeler({
        container: '#canvas',
        propertiesPanel: {
            parent: '#properties'
        },
        additionalModules: [
            BpmnPropertiesPanelModule,
            BpmnPropertiesProviderModule
        ],
    });

    try {
        await modeler.importXML(props.xml);
    } catch (err) {
        console.log('error rendering', err);
    }
})

const saveDiagram = async () => {
    const xml = await modeler.saveXML();
    console.log(xml);
}
</script>

<template>
    <div class='h-full w-full bg-white'>
        <div class="modeler grid grid-cols-4 h-full">
            <div id="canvas" class='col-span-3'></div>
            <div id="properties" class='border-l-4'></div>
        </div>
    </div>
</template>

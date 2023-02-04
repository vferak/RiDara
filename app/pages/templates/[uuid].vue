<script setup lang='ts'>
const route = useRoute();
const { getTemplate, getTemplateBpmnFile, saveTemplateBpmnFile } = useTemplate();
const { getOntologyNodes } = useOntology();

const templateUuid = route.params.uuid.toString();

const { data: template } = await getTemplate(templateUuid);
const { data: ontologyNodes } = await getOntologyNodes(template.value!.ontologyFile.uuid);
const { data: xml } = await getTemplateBpmnFile(templateUuid);

const upmmOptions = ontologyNodes.value!.map((ontologyNode) => {
    return {
        value: ontologyNode.uuid,
        label: ontologyNode.name,
    }
});

const successToast = useState<boolean>(() => false);

onBeforeRouteLeave((to, from, next) => {
    const confirmed = confirm('Are you sure you want to leave? All unsaved progress will be lost.');
    if (!confirmed) {
        next(false);
        return;
    }

    next();
});

const saveTemplateFile = async (xml: string): Promise<void> => {
    await saveTemplateBpmnFile(templateUuid, xml);
    successToast.value = true;
}
</script>

<template>
    <div class='h-full'>
        <Toast v-model='successToast'>
            <AlertSuccess>Diagram saved!</AlertSuccess>
        </Toast>
        <BpmnModeler :xml='xml' :upmm-options='upmmOptions' @save-bpmn='saveTemplateFile'/>
    </div>
</template>

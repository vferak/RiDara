<script setup lang='ts'>
const route = useRoute();
const { getTemplateBpmnFile, saveTemplateBpmnFile } = useTemplate();

const templateUuid = route.params.uuid.toString();

const { data: xml } = await getTemplateBpmnFile(templateUuid);

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
        <BpmnModeler :xml='xml' @save-bpmn='saveTemplateFile'/>
    </div>
</template>

<script setup lang='ts'>
const route = useRoute();
const {
    getTemplate,
    getTemplateBpmnFile,
    saveTemplateBpmnFile,
    publishTemplate,
    analyze
} = useTemplate();
const { getOntologyNodes } = useOntology();

const templateUuid = route.params.uuid.toString();

const { modalState, openModal, closeModal } = useModal('template-analyze');
const { data: template } = await getTemplate(templateUuid);
const { data: ontologyNodes } = await getOntologyNodes(template.value!.ontologyFile.uuid);
const { data: xml } = await getTemplateBpmnFile(templateUuid);

const upmmOptions = ontologyNodes.value!.map((ontologyNode) => {
    return {
        value: ontologyNode.uuid,
        label: ontologyNode.name,
    }
});

const successSaveToast = useState<boolean>(() => false);
const successPublishToast = useState<boolean>(() => false);
let errorTemplateData = useState();

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
    successSaveToast.value = true;
}

const publish = async (): Promise<void> => {
    await publishTemplate(templateUuid);
    successPublishToast.value = true;
}

const analyzeTemplate = async (): Promise<void> => {
    const result = await analyze(templateUuid);
    errorTemplateData.value = result.data.value;
    openModal();
}

</script>

<template>
    <div class='h-full'>
        <Toast v-model='successSaveToast'>
            <AlertSuccess>Template saved!</AlertSuccess>
        </Toast>
        <Toast v-model='successPublishToast'>
            <AlertSuccess>Template published!</AlertSuccess>
        </Toast>
        <BpmnModeler :xml='xml' :upmm-options='upmmOptions' @save-bpmn='saveTemplateFile' :is-template='true'/>

        <Modal v-if='modalState' v-model='modalState'>
            <CardsAnalyzeTemplateCard :error-template='errorTemplateData'/>
        </Modal>

        <div class='flex justify-between fixed bottom-32 items-center ml-2'>
            <button @click='publish' class='btn btn-primary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                Publish
            </button>
            <button @click='analyzeTemplate' class='btn btn-primary mt-4 ml-3 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
                Analyze
            </button>
        </div>
    </div>
</template>

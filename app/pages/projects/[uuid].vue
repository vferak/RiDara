<script setup lang='ts'>
const route = useRoute();
const { modalState, openModal, closeModal } = useModal('project-analyze');

const { getProjectFile, saveProjectBpmnFile, analyzeFirstLevel, getNodesByProject } = useProject();

const projectUuid = route.params.uuid.toString();


const { data: ontologyNodes } = await getNodesByProject(projectUuid);


const upmmOptions = ontologyNodes.value!.map((ontologyNode) => {
    return {
        value: ontologyNode.uuid,
        label: ontologyNode.name,
    }
});

const { data: xml } = await getProjectFile(projectUuid);

const successToast = useState<boolean>();

onBeforeRouteLeave((to, from, next) => {
    const confirmed = confirm('Are you sure you want to leave? All unsaved progress will be lost.');
    if (!confirmed) {
        next(false);
        return;
    }

    next();
});

let missingMap = useState<Map<string, number>>(() => new Map<string, number>());
let notRecognizedMap = useState<Map<string, number>>(() => new Map<string, number>());
let overExtendsMap = useState<Map<string, number>>(() => new Map<string, number>());
let percentValue = useState<number>(() => 0);

const analyze = async (): Promise<void> => {
    const result = await analyzeFirstLevel(projectUuid);
    const arg = JSON.parse(JSON.stringify(result.data.value));
    percentValue.value = arg[0];

    if (arg[1] !== null) {
        let missingJson = arg[1][0];
        let notRecognizedToJson = arg[1][1];
        let overExtendsToJson = arg[1][2];

        if (JSON.stringify(missingJson) === '{}' && JSON.stringify(overExtendsToJson) === '{}'
            && JSON.stringify(notRecognizedToJson) === '{}') {
            missingMap.value = new Map<string, number>();
            notRecognizedMap.value = new Map<string, number>();
            overExtendsMap.value = new Map<string, number>();
        } else {
            missingJson = JSON.parse(missingJson);
            notRecognizedToJson = JSON.parse(notRecognizedToJson);
            overExtendsToJson = JSON.parse(overExtendsToJson);

            missingMap.value = new Map<string, number>(missingJson);
            notRecognizedMap.value = new Map<string, number>(notRecognizedToJson);
            overExtendsMap.value = new Map<string, number>(overExtendsToJson);
        }
        openModal();
    }

}
const saveProjectFile = async (xml: string): Promise<void> => {
    await saveProjectBpmnFile(projectUuid, xml);
    successToast.value = true;
}
</script>

<template>
    <div class='h-full'>
        <Toast v-model='successToast'>
            <AlertSuccess>Diagram saved!</AlertSuccess>
        </Toast>
        <BpmnModeler :xml='xml' :upmm-options='upmmOptions' @save-bpmn='saveProjectFile'/>
    </div>
    <Modal v-if='modalState' v-model='modalState'>
        <AnalyzeCard :missmissing-map='missingMap' :not-recognized-map='notRecognizedMap' :over-extends-map='overExtendsMap' :percent-value='percentValue'/>
    </Modal>
    <div class="flex justify-between fixed bottom-32 items-center ml-2">
        <button @click='analyze' class='btn btn-primary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
            Analyze
        </button>
    </div>
</template>

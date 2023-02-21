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
    };
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

let missingMapFirstLevel = useState<Map<string, number>>(() => new Map<string, number>());
let notRecognizedMapFirstLevel = useState<Map<string, number>>(() => new Map<string, number>());
let overExtendsMapFirstLevel = useState<Map<string, number>>(() => new Map<string, number>());
let errorsShapeMapSecondLevel = useState<Map<string, string>>(() => new Map<string, string>());
let percentValueFirstLevel = useState();
let percentValueSecondLevel = useState();

const analyze1 = async (): Promise<void> => {
    const result = await analyzeFirstLevel(projectUuid);
    const analyzedJsonData = result.data.value;
    percentValueFirstLevel.value = analyzedJsonData?.percentArray.shift();
    percentValueSecondLevel.value = analyzedJsonData?.percentArray.shift();

    let missingJsonFirstLevel = analyzedJsonData?.missingMap!;
    let notRecognizedJsonFirstLevel = analyzedJsonData?.notRecognizedMap!;
    let overExtendsJsonFirstLevel = analyzedJsonData?.overExtendsMap!;

    if (missingJsonFirstLevel === '') {
        missingMapFirstLevel.value = new Map<string, number>();

    } else {
        missingMapFirstLevel.value = new Map<string, number>(JSON.parse(missingJsonFirstLevel));
    }

    if (notRecognizedJsonFirstLevel === '') {
        notRecognizedMapFirstLevel.value = new Map<string, number>();
    } else {
        notRecognizedMapFirstLevel.value = new Map<string, number>(JSON.parse(notRecognizedJsonFirstLevel));
    }

    if (overExtendsJsonFirstLevel === '') {
        overExtendsMapFirstLevel.value = new Map<string, number>();
    } else {
        overExtendsMapFirstLevel.value = new Map<string, number>(JSON.parse(overExtendsJsonFirstLevel));
    }

    if (missingMapFirstLevel.value.size === 0 && notRecognizedMapFirstLevel.value.size === 0 && overExtendsMapFirstLevel.value.size === 0) {
        let errorsShapeJsonSecondLevel = analyzedJsonData?.shapeMap!;

        if (errorsShapeJsonSecondLevel === '') {
            errorsShapeMapSecondLevel.value = new Map<string, string>();
        } else {
            errorsShapeMapSecondLevel.value = new Map<string, string>(JSON.parse(errorsShapeJsonSecondLevel));
        }
    }
    openModal();

};

const saveProjectFile = async (xml: string): Promise<void> => {
    await saveProjectBpmnFile(projectUuid, xml);
    successToast.value = true;
};
</script>

<template>
    <div class='h-full'>
        <Toast v-model='successToast'>
            <AlertSuccess>Diagram saved!</AlertSuccess>
        </Toast>
        <BpmnModeler :xml='xml' :upmm-options='upmmOptions' @save-bpmn='saveProjectFile' />
    </div>
    <Modal v-if='modalState' v-model='modalState'>
        <CardsAnalyzeCard :missmissing-map='missingMapFirstLevel' :not-recognized-map='notRecognizedMapFirstLevel'
                          :over-extends-map='overExtendsMapFirstLevel' :percent-value-first='percentValueFirstLevel'
                          :shape-map='errorsShapeMapSecondLevel'
                          :percent-value-second='percentValueSecondLevel' />
    </Modal>
    <div class='flex justify-between fixed bottom-32 items-center ml-2'>
        <button @click='analyze1' class='btn btn-primary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
            Analyze
        </button>
    </div>
</template>

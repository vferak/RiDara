<script setup lang='ts'>

const route = useRoute();
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

const analyze = async (): Promise<void> => {
    const result = await analyzeFirstLevel (projectUuid);
    const arg = JSON.parse(JSON.stringify(result.data.value));
    const percentValue = arg[0];

    if (arg.length !== 1) {
        let missingJson = arg[1][0];
        let notRecognizedToJson = arg[1][1];
        let overExtendsToJson = arg[1][2];

        missingJson = JSON.parse(missingJson);
        notRecognizedToJson = JSON.parse(notRecognizedToJson);
        overExtendsToJson = JSON.parse(overExtendsToJson);

        missingMap.value = new Map<string, number>(missingJson);
        notRecognizedMap.value = new Map<string, number>(notRecognizedToJson);
        overExtendsMap.value = new Map<string, number>(overExtendsToJson);
    }


}
const saveProjectFile = async (xml: string): Promise<void> => {
    await saveProjectBpmnFile(projectUuid, xml);
    successToast.value = true;
}
</script>

<template>
    <div class='h-full'>
        <button @click='analyze' class='btn btn-primary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
            Analyze
        </button>
        <div v-if='missingMap.size !== 0' v-for="(value, key) in missingMap" :key="key">
            <p>Missing elements:
                {{ value[0] }} - {{ value[1] }}</p>
        </div>

        <div v-if='notRecognizedMap.size !== 0' v-for="(value, key) in notRecognizedMap" :key="key">
            <p>Not recognized elements:
                {{ value[0] }} - {{ value[1] }}</p>
        </div>

        <div v-if='overExtendsMap.size !== 0' v-for="(value, key) in overExtendsMap" :key="key">
            <p>Over extends elements:
                {{ value[0] }} - {{ value[1] }}</p>
        </div>


        <Toast v-model='successToast'>
            <AlertSuccess>Diagram saved!</AlertSuccess>
        </Toast>
        <BpmnModeler :xml='xml' :upmm-options='upmmOptions' @save-bpmn='saveProjectFile'/>

    </div>
</template>

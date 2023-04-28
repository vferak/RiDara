<script setup lang='ts'>

import { RelationErrorDeserializedData } from '~/composables/types';
const { $bpmnModeler } = useNuxtApp();

const route = useRoute();
const { modalState, openModal, closeModal } = useModal('project-analyze');

const {
    getProjectFile,
    saveProjectBpmnFile,
    getNodesByProject,
    analyze,
    checkForNewProjectTemplateVersion,
    updateProjectToNewTemplateVersion,
} = useProject();

const projectUuid = route.params.uuid.toString();

const { data: ontologyNodes } = await getNodesByProject(projectUuid);


const upmmOptions = ontologyNodes.value!.map((ontologyNode) => {
    return {
        value: ontologyNode.uuid,
        label: ontologyNode.name,
    };
});

const { data: xml } = await getProjectFile(projectUuid);

const successToast = useState<boolean>(() => false);

onBeforeRouteLeave((to, from, next) => {
    const confirmed = confirm('Are you sure you want to leave? All unsaved progress will be lost.');
    if (!confirmed) {
        next(false);
        return;
    }
    next();
});

let missingMapFirstLevel = useState<Map<string, number>>(() => new Map<string, number>());
let overExtendsMapFirstLevel = useState<Map<string, number>>(() => new Map<string, number>());
let errorsShapeMapSecondLevel = useState<Map<string, string>>(() => new Map<string, string>());
let relationErrorDeserializedData = ref<RelationErrorDeserializedData[]>([]);

let percentValueFirstLevel = useState();
let percentValueSecondLevel = useState();
let percentValueThirdLevel = useState();

const analyzeProject = async (): Promise<void> => {
    const xml = await $bpmnModeler.get().saveXML();
    await saveProjectFile(xml.xml);

    const result = await analyze(projectUuid);
    const analyzedJsonData = result.data.value;
    relationErrorDeserializedData.value = [];

    percentValueFirstLevel.value = analyzedJsonData?.percentArray.shift();
    if (percentValueFirstLevel.value === undefined) {
        percentValueFirstLevel.value = 0;
    }

    percentValueSecondLevel.value = analyzedJsonData?.percentArray.shift();
    if (percentValueSecondLevel.value === undefined) {
        percentValueSecondLevel.value = 0;
    }

    percentValueThirdLevel.value = analyzedJsonData?.percentArray.shift();
    if (percentValueThirdLevel.value === undefined) {
        percentValueThirdLevel.value = 0;
    }

    let missingJsonFirstLevel = analyzedJsonData?.missingMap!;
    let overExtendsJsonFirstLevel = analyzedJsonData?.overExtendsMap!;

    if (missingJsonFirstLevel === '') {
        missingMapFirstLevel.value = new Map<string, number>();

    } else {
        missingMapFirstLevel.value = new Map<string, number>(JSON.parse(missingJsonFirstLevel));
    }


    if (overExtendsJsonFirstLevel === '') {
        overExtendsMapFirstLevel.value = new Map<string, number>();
    } else {
        overExtendsMapFirstLevel.value = new Map<string, number>(JSON.parse(overExtendsJsonFirstLevel));
    }

    if (missingMapFirstLevel.value.size === 0 && overExtendsMapFirstLevel.value.size === 0) {
        let errorsShapeJsonSecondLevel = analyzedJsonData?.shapeMap!;

        if (errorsShapeJsonSecondLevel === '') {
            errorsShapeMapSecondLevel.value = new Map<string, string>();
        } else {
            errorsShapeMapSecondLevel.value = new Map<string, string>(JSON.parse(errorsShapeJsonSecondLevel));
        }
    }

    if (analyzedJsonData?.relationErrorJsonData === undefined || analyzedJsonData?.relationErrorJsonData.length === 0) {
        relationErrorDeserializedData.value = [];
    } else {
        for (const relationError of analyzedJsonData.relationErrorJsonData) {
            let missingRelationsMap;
            let overExtendsRelationsMap;
            if (relationError.missingRelations === '') {
                missingRelationsMap = new Map<string, string>();
            } else {
                missingRelationsMap = new Map<string, string>(JSON.parse(relationError.missingRelations!));
            }

            if (relationError.overExtendsRelations === '') {
                overExtendsRelationsMap = new Map<string, string>();
            } else {
                overExtendsRelationsMap = new Map<string, string>(JSON.parse(relationError.overExtendsRelations!));
            }

            const errorDeserializedData: RelationErrorDeserializedData = {
                upmmId: relationError.upmmId,
                elementId: relationError.elementId,
                errorsRelations: relationError.errorsRelations,
                missingRelations: missingRelationsMap,
                overExtendsRelations: overExtendsRelationsMap
            };
            relationErrorDeserializedData.value.push(errorDeserializedData);
        }
    }
    openModal();

};

const saveProjectFile = async (xml: string): Promise<void> => {
    await saveProjectBpmnFile(projectUuid, xml);
    successToast.value = true;
};

const { data: newTemplateVersionIsAvailable } = await checkForNewProjectTemplateVersion(projectUuid);

const availableTemplateUpdateToast = useState<boolean>(() => false);
const templateVersionSuccessfullyUpdated = useState<boolean>(() => false);

if (newTemplateVersionIsAvailable.value === "true") {
    availableTemplateUpdateToast.value = true;
}

const updateTemplateVersion = async (): Promise<void> => {
    const confirmed = confirm('Do you really want to update the template version of this project? This action is irreversible.')

    if (confirmed) {
        await updateProjectToNewTemplateVersion(projectUuid);
        templateVersionSuccessfullyUpdated.value = true;
        newTemplateVersionIsAvailable.value = "false";
    }
}
</script>

<template>
    <div class='h-full'>
        <Toast v-model='successToast'>
            <AlertSuccess>Diagram saved!</AlertSuccess>
        </Toast>
        <Toast v-model='availableTemplateUpdateToast'>
            <AlertInform>New template version for this project is available!</AlertInform>
        </Toast>
        <Toast v-model='templateVersionSuccessfullyUpdated'>
            <AlertSuccess>Project template version was successfully updated!</AlertSuccess>
        </Toast>
        <BpmnModeler :xml='xml' :upmm-options='upmmOptions' @save-bpmn='saveProjectFile' :is-template='false'/>
    </div>
    <Modal v-if='modalState' v-model='modalState'>
        <CardsAnalyzeCard :missing-map='missingMapFirstLevel' :over-extends-map='overExtendsMapFirstLevel'
                          :percent-value-first='percentValueFirstLevel' :shape-map='errorsShapeMapSecondLevel'
                          :percent-value-second='percentValueSecondLevel' :percent-value-third='percentValueThirdLevel'
                          :relation-error-data='relationErrorDeserializedData'/>
    </Modal>
    <div class='flex justify-between fixed bottom-32 items-center ml-2'>
        <button v-if='newTemplateVersionIsAvailable === "true"' @click='updateTemplateVersion' class='btn btn-secondary mt-4 mr-2 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
            Update template version
        </button>
        <button @click='analyzeProject' class='btn btn-primary mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg'>
            Analyze
        </button>
    </div>
</template>

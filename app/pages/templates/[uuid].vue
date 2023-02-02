<script setup lang='ts'>
const { data: xmlBlob } = await useFetch<Blob>('/diagram.bpmn');
const xml = await xmlBlob.value?.text();

onBeforeRouteLeave((to, from, next) => {
    const confirmed = confirm('Are you sure you want to leave? All unsaved progress will be lost.');
    if (!confirmed) {
        next(false);
        return;
    }

    next();
});
</script>

<template>
    <div class='h-full'>
        <BpmnModeler :xml='xml'/>
    </div>
</template>

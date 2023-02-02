<script setup lang='ts'>
const { data: xmlBlob } = await useFetch<Blob>('/diagram.bpmn');
const xml = await xmlBlob.value?.text();
</script>

<template>
    <div class='h-full'>
        <BpmnModeler :xml='xml'/>
    </div>
</template>

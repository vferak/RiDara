<script setup>

const templates = [
    {id: 1, name: 'První template', description: 'První pospis template'},
    {id: 2, name: 'Druhy template', description: 'Druhy pospis template'},
    {id: 3, name: 'Treti template', description: 'Treti pospis template'},
    {id: 4, name: 'Ctvrty template', description: 'Ctvrty pospis template'}
]
</script>

<template>
  <div class="container mx-auto">

    <div class="flex items-center justify-between">
      <p class="mb-4 mt-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Your diagrams</p>
      <div class="text-end space-x-3">
        <button class="btn mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg">New diagram</button>
        <button class="btn mt-4 btn-xs sm:btn-sm md:btn-md lg:btn-lg">Import diagram</button>
      </div>

    </div>

    <div class="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5">
      <cards-diagram-card v-for="template in templates" :key="template.id" :templates="template"/>
    </div>
  </div>
</template>

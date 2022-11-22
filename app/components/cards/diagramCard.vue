<script setup lang="ts">
const {templates} = defineProps<{templates: {name: string, description: string}}>()
</script>

<template>
  <div>
    <div class="card w-50 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{{ templates.name }}</h2>
        <p>{{ templates.description }}</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Detail šablony</button>
        </div>
      </div>
    </div>

  </div>

</template>

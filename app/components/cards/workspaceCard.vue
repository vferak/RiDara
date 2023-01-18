<script setup lang="ts">
import { Workspace } from '~/composables/useWorkspace';

const { workspace } = defineProps<{ workspace: Workspace }>()
</script>

<template>
  <div>
    <div class="card w-50 bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{{ workspace.name }}</h2>
        <p>{{ workspace.owner.email }}</p>
          <p>Projects: 8</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Open</button>
        </div>
      </div>
    </div>
  </div>
</template>


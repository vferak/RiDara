<script setup lang="ts">
const layoutName = useState<string>(() => "home-layout");
/*ref<string>("home-layout");*/
</script>
<template>
  <div>
    <NuxtLayout :name="layoutName">
      <NuxtPage/>
    </NuxtLayout>
  </div>
</template>

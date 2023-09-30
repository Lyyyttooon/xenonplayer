<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="title-bar"></div>
  <RouterView />
</template>

<style scoped>
.title-bar {
  height: 35px;
  background-color: #323233;
  -webkit-app-region: drag;
}
</style>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useFullscreenStore } from '@/stores/fullscreen'

const fullScreenStore = useFullscreenStore()

document.addEventListener('keyup', (e) => {
  if (e.key === 'F5') {
    window.location.reload()
  }
})
</script>

<template>
  <div class="title-bar" v-if="!fullScreenStore.isFullscreen"></div>
  <RouterView />
</template>

<style scoped>
.title-bar {
  height: 35px;
  background-color: #323233;
  -webkit-app-region: drag;
}
</style>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useFullscreenStore } from '@/stores/fullscreen'
import { useVideoInfoStore } from './stores/videoInfo'

const fullScreenStore = useFullscreenStore()
const videoInfoStore = useVideoInfoStore()

document.addEventListener('keyup', (e) => {
  if (e.key === 'F5') {
    window.location.reload()
  }
})
</script>

<template>
  <div class="title-bar" v-if="fullScreenStore.showTitleBar">
    {{ videoInfoStore.videoInfo.name }}
  </div>
  <RouterView />
</template>

<style scoped>
.title-bar {
  height: 35px;
  line-height: 35px;
  background-color: #323233;
  -webkit-app-region: drag;
  position: relative;
  z-index: 99;
  text-align: center;
}
</style>

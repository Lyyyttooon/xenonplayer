<script setup lang="ts">
import VideoPlayer from '@/components/VideoPlayer.vue'
import { useFullscreenStore } from '@/stores/fullscreen'
import { computed, watch } from 'vue'

const fullScreenStore = useFullscreenStore()

const handleFullScreen = computed(() => {
  if (fullScreenStore.isFullscreen) {
    return {
      height: '100%'
    }
  }
  return undefined
})
</script>

<template>
  <main class="main-video-player" :style="handleFullScreen">
    <VideoPlayer />
  </main>
</template>

<style scoped>
.main-video-player {
  height: calc(100% - 35px);
  width: 100%;
}
</style>

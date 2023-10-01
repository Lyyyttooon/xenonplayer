<script setup lang="ts">
import VideoPlayer from '@/components/VideoPlayer.vue'
</script>

<template>
  <main class="main-video-player">
    <VideoPlayer />
  </main>
</template>

<style scoped>
.main-video-player {
  height: calc(100% - 35px);
  width: 100%;
}
</style>

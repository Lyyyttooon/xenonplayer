<script setup lang="ts"></script>
<template>
  <div class="video-player">
    <video class="video"></video>
    <div class="control-bar"></div>
  </div>
</template>

<style scoped>
.video-player {
  height: 100%;
  width: 100%;
}
.video {
  display: block;
  height: calc(100% - 56px);
  margin: auto;
  width: 100%;
}

.control-bar {
  background-color: #323233;
  height: 56px;
  flex: none;
}
</style>

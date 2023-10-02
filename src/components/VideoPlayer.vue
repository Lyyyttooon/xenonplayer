<script setup lang="ts"></script>
<template>
  <div class="video-player">
    <video class="video" controls>
      <source src="" />
    </video>
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
  height: calc(100% - 64px);
  margin: auto;
  width: 100%;
}

.control-bar {
  background-color: #323233;
  height: 64px;
  flex: none;
}
</style>

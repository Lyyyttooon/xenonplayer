<script setup lang="ts">
import { ref } from 'vue'

const videoUrl = ref('')

const openFile = () => {
  const input = document.getElementById('open-file')
  input?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.item(0)
  if (file) {
    videoUrl.value = URL.createObjectURL(file)
  }
}
</script>
<template>
  <div class="video-player">
    <video v-if="videoUrl !== ''" class="video" controls>
      <source :src="videoUrl" />
    </video>
    <div v-else class="open-file-container">
      <el-button @click="openFile">点击打开</el-button>
      <input
        id="open-file"
        style="display: none"
        type="file"
        accept="video/*"
        @change="handleFileChange"
      />
    </div>
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
  background-color: #1e1e1e;
}

.open-file-container {
  height: calc(100% - 64px);
  display: flex;
  background-color: #1e1e1e;
  align-items: center;
  justify-content: center;
}

.control-bar {
  background-color: #323233;
  height: 64px;
  flex: none;
}
</style>

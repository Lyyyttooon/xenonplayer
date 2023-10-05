<script setup lang="ts">
import { nextTick, ref } from 'vue'

const videoUrl = ref('')
const videoElement = ref<HTMLVideoElement | null>(null)

const openFile = () => {
  const input = document.getElementById('open-file')
  input?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.item(0)
  if (file) {
    videoUrl.value = URL.createObjectURL(file)
    nextTick(() => {
      console.log(videoElement.value)
      videoElement.value?.play()
    })
  }
}
</script>

<template>
  <div class="video-player">
    <video ref="videoElement" v-if="videoUrl !== ''" class="video" controls>
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
    <div class="control-bar">
      <div class="process-bar">
        <div class="process-container">
          <div class="scrubber-button"></div>
          <div class="fill-line"></div>
        </div>
        <div class="volume-container"></div>
      </div>
      <div class="control-btns"></div>
    </div>
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
  background-color: #000;
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

.process-bar {
  height: 24px;
  border-bottom: 1px solid #000;
  display: flex;

  .process-container {
    height: 100%;
    width: calc(100% - 128px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;

    .fill-line {
      height: 2px;
      width: 100%;
      background-color: #575656;
    }

    .scrubber-button {
      height: 12px;
      width: 12px;
      border-radius: 6px;
      background-color: #c9c9c9;
      position: relative;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      transform: translateX(0px);
    }
  }

  .volume-container {
    height: 100%;
    width: 128px;
  }
}
</style>

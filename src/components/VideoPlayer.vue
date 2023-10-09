<script setup lang="ts">
import { nextTick, ref } from 'vue'

const videoUrl = ref('')
const videoElement = ref<HTMLVideoElement | null>(null)
const videoStatus = ref('pause')

const openFile = () => {
  const input = document.getElementById('open-file')
  input?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.item(0)
  if (file) {
    stopVideo()
    nextTick(() => {
      videoUrl.value = URL.createObjectURL(file)
      nextTick(() => {
        playPauseVideo()
      })
    })
  }
}

const playPauseVideo = () => {
  if (videoUrl.value === '') {
    return
  }
  if (videoStatus.value === 'pause') {
    videoElement.value?.play()
    videoStatus.value = 'play'
  } else {
    videoElement.value?.pause()
    videoStatus.value = 'pause'
  }
}

const stopVideo = () => {
  videoUrl.value = ''
  videoStatus.value = 'pause'
}

window.electronAPI.onFileOpened((url: string, blobData: Blob) => {
  videoUrl.value = URL.createObjectURL(new Blob([blobData]))
})
</script>

<template>
  <div class="video-player">
    <video ref="videoElement" v-if="videoUrl !== ''" class="video" @dblclick="playPauseVideo">
      <source :src="videoUrl" />
    </video>
    <div v-else class="open-file-container"></div>
    <div class="control-bar">
      <div class="process-bar">
        <div class="process-container">
          <div id="video-scrubber-button" class="scrubber-button"></div>
          <div class="fill-line"></div>
        </div>
        <div class="volume-container">
          <img src="@/assets/icons-voice.png" />
          <div id="volume-scrubber-button" class="scrubber-button"></div>
          <div class="fill-line"></div>
        </div>
      </div>
      <div class="control-btns">
        <div class="btn start-pause-btn" @click="playPauseVideo">
          <img v-if="videoUrl === '' || videoStatus === 'pause'" src="@/assets/icons-play.png" />
          <img v-else src="@/assets/icons-pause.png" />
        </div>
        <div class="btn stop-btn" @click="stopVideo">
          <img src="@/assets/icons-stop.png" />
        </div>
        <div class="btn before-btn">
          <img src="@/assets/icons-previous.png" />
        </div>
        <div class="btn next-btn">
          <img src="@/assets/icons-next.png" />
        </div>
        <div class="btn open-btn" @click="openFile">
          <img src="@/assets/icons-open.png" />
          <input
            id="open-file"
            style="display: none"
            type="file"
            accept="video/*, .mkv"
            @change="handleFileChange"
          />
        </div>
      </div>
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

.scrubber-button {
  height: 11px;
  width: 11px;
  border-radius: 5.5px;
  border: 1px solid #000;
  background-color: #ffffff;
}

.process-bar {
  height: 24px;
  border-bottom: 1px solid #000;
  display: flex;

  .process-container {
    position: relative;
    height: 100%;
    width: calc(100% - 112px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;

    > .fill-line {
      height: 2px;
      width: 100%;
      background-color: #575656;
    }

    > #video-scrubber-button {
      position: absolute;
      left: 5px;
      right: 0;
      top: 25%;
      bottom: 0;
      transform: translateX(0px);
    }
  }

  .volume-container {
    position: relative;
    height: 100%;
    width: 112px;
    display: inline-flex;
    align-items: center;
    flex-direction: row;

    > img {
      height: 14px;
      width: 14px;
    }

    .fill-line {
      height: 2px;
      width: 100%;
      background-color: #575656;
      margin: 0 12px 0 4px;
    }

    #volume-scrubber-button {
      position: absolute;
      left: 17px;
      right: 0;
      top: 25%;
      bottom: 0;
      transform: translateX(0px);
    }
  }
}

.control-btns {
  height: calc(100% - 24px);
  display: flex;
  user-select: none;

  > .btn {
    height: 100%;
    width: 40px;
    background-color: #323233;
    border-right: 1px solid #000;
    display: flex;
    justify-content: center;
    align-items: center;

    > img {
      width: 12px;
      height: 12px;
    }
  }

  > .btn:hover {
    background-color: #3b3b3b;
  }
  > .btn:active {
    background-color: #2c2c2c;
  }
}
</style>

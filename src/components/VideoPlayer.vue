<script setup lang="ts">
import { useFullscreenStore } from '@/stores/fullscreen'
import { computed, nextTick, ref, watch } from 'vue'

const fullScreenStore = useFullscreenStore()

interface HotkeyEvent {
  [key: string]: () => void
}

const videoUrl = ref('')
const videoElement = ref<HTMLVideoElement | null>(null)
const videoStatus = ref('pause')
const videoProcess = ref(0)
const volumeProcess = ref(1)
const controlBarShow = ref(true)

// methods
const openFile = () => {
  window.electronAPI.setDialog({
    filters: [
      { name: '视频文件', extensions: ['mp4', 'mkv', 'webm'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  })
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.item(0)
  if (file) {
    console.log(file)
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
  videoProcess.value = 0
}

const videoTimeJump = () => {
  if (!videoElement.value) {
    return
  }
  videoElement.value.currentTime += 5
}

const fullScreen = () => {
  if (!videoElement.value) {
    return
  }
  fullScreenStore.toggleFullscreen()
  window.electronAPI.setFullScreen(fullScreenStore.isFullscreen)
}

const hotkeyEvent: HotkeyEvent = {
  Space: playPauseVideo,
  ArrowRight: videoTimeJump,
  Enter: fullScreen
}

// watch
watch(
  () => fullScreenStore.isFullscreen,
  (value) => {
    if (value) {
      controlBarShow.value = false
    } else {
      controlBarShow.value = true
    }
  }
)

// computed
const videoProcessButtonStyle = computed(() => {
  return {
    left: `${(videoProcess.value * 100).toFixed(2)}%`
  }
})

const volumeButtonStyle = computed(() => {
  return {
    left: `${(volumeProcess.value * 90).toFixed(2)}%`
  }
})

const controlBarFullScreenStyle = computed(() => {
  if (fullScreenStore.isFullscreen) {
    return {
      position: 'absolute' as 'absolute',
      width: '100%',
      bottom: 0
    }
  }
  return undefined
})

const videoFullScreenStyle = computed(() => {
  if (fullScreenStore.isFullscreen) {
    return {
      height: '100%'
    }
  }
  return undefined
})

// electron method
// 使用electron ipc打开文件
window.electronAPI.onFileOpened((url: string, blobData: Blob) => {
  stopVideo()
  nextTick(() => {
    videoUrl.value = URL.createObjectURL(new Blob([blobData]))
    nextTick(() => {
      playPauseVideo()
      if (!videoElement.value) {
        return
      }
      videoElement.value.addEventListener('timeupdate', () => {
        let currentTime = videoElement.value?.currentTime ? videoElement.value?.currentTime : 0
        let duration = videoElement.value?.duration ? videoElement.value?.duration : 0
        videoProcess.value = currentTime / duration
      })
      videoElement.value.volume = volumeProcess.value
    })
  })
})

// event listener
document.addEventListener('keyup', (e) => {
  if (hotkeyEvent[e.code]) {
    hotkeyEvent[e.code]()
  }
})
</script>

<template>
  <div class="video-player">
    <video
      ref="videoElement"
      v-if="videoUrl !== ''"
      class="video"
      @dblclick="playPauseVideo"
      :style="videoFullScreenStyle"
    >
      <source :src="videoUrl" />
    </video>
    <div v-else class="open-file-container"></div>
    <div class="control-bar" :style="controlBarFullScreenStyle" v-show="controlBarShow">
      <div class="process-bar">
        <div class="process-container">
          <div
            id="video-scrubber-button"
            class="scrubber-button"
            :style="videoProcessButtonStyle"
          ></div>
          <div class="fill-line"></div>
        </div>
        <img src="@/assets/icons-voice.png" style="height: 14px; width: 14px" />
        <div class="volume-container">
          <div id="volume-scrubber-button" class="scrubber-button" :style="volumeButtonStyle"></div>
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
        <!-- <div class="btn before-btn">
          <img src="@/assets/icons-previous.png" />
        </div>
        <div class="btn next-btn">
          <img src="@/assets/icons-next.png" />
        </div> -->
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
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .process-container {
    position: relative;
    height: 100%;
    width: calc(100% - 112px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0 16px 0 8px;

    > .fill-line {
      height: 2px;
      width: 100%;
      background-color: #575656;
    }

    > #video-scrubber-button {
      position: absolute;
      left: 0;
      right: 0;
      top: 26%;
      bottom: 0;
      transform: translateX(0px);
    }
  }

  .volume-container {
    position: relative;
    height: 100%;
    width: 96px;
    display: inline-flex;
    align-items: center;
    flex-direction: row;
    margin: 0 16px 0 8px;

    .fill-line {
      height: 2px;
      width: 100%;
      background-color: #575656;
    }

    #volume-scrubber-button {
      position: absolute;
      left: 0;
      right: 0;
      top: 26%;
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

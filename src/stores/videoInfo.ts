import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVideoInfoStore = defineStore('videoInfo', () => {
  const videoInfo = ref({ name: '' })

  const updateVideoInfo = (data: { name: string }) => {
    videoInfo.value = data
  }

  return { videoInfo, updateVideoInfo }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFullscreenStore = defineStore('fullscreen', () => {
  const isFullscreen = ref(false)
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
  }
  return { isFullscreen, toggleFullscreen }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFullscreenStore = defineStore('fullscreen', () => {
  const isFullscreen = ref(false)
  const showTitleBar = ref(true)
  const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value
  }
  const toggleTitleBar = () => {
    showTitleBar.value = !showTitleBar.value
  }
  return { isFullscreen, toggleFullscreen, showTitleBar, toggleTitleBar }
})

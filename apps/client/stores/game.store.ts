import { defineStore } from 'pinia'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { SceneManager } from '~/lib/three/Scenes/SceneManager'
import { InputManager } from '~/lib/three/Input/InputManager'

export const useGameStore = defineStore('game', () => {
    const sceneManager = ref<SceneManager | null>(null)
    const container = ref<HTMLElement | null>(null)
    const _isPlaying = ref(false)
    const inputManager = ref<InputManager | null>(null)

    const isPlaying = computed(() => _isPlaying.value)

    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            pause()
        }
    }

    const handlePointerLockChange = () => {
        if (!document.pointerLockElement) {
            pause()
        }
    }

    const setupEventListeners = () => {
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        document.addEventListener('pointerlockchange', handlePointerLockChange)
    }

    const removeEventListeners = () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange)
        document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }

    const initializeSceneManager = (containerElement: HTMLElement) => {
        if (sceneManager.value) return

        container.value = containerElement
        sceneManager.value = new SceneManager(containerElement)
        inputManager.value = InputManager.getInstance()
        sceneManager.value.start()
        setupEventListeners()
    }

    const requestPointerLock = async () => {
        if (!container.value) return false

        try {
            await container.value.requestPointerLock()
            return true
        } catch (error) {
            console.warn('Pointer Lock error:', error)
            return false
        }
    }

    const requestFullscreen = async () => {
        if (!container.value) return false

        try {
            await container.value.requestFullscreen()
            return true
        } catch (error) {
            console.warn('Fullscreen error:', error)
            return false
        }
    }

    const play = async () => {
        if (!sceneManager.value || !container.value) return

        // D'abord demander le fullscreen
        const fullscreenSuccess = await requestFullscreen()
        if (!fullscreenSuccess) return

        // Puis demander le pointer lock
        const pointerLockSuccess = await requestPointerLock()
        if (!pointerLockSuccess) {
            // Si le pointer lock échoue, on sort du fullscreen
            pause()
            return
        }

        _isPlaying.value = true
    }

    const pause = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        }
        if (document.pointerLockElement) {
            document.exitPointerLock()
        }
        _isPlaying.value = false
    }

    const destroy = () => {
        if (sceneManager.value) {
            sceneManager.value.destroy()
            sceneManager.value = null
            if (inputManager.value) {
                inputManager.value.destroy()
                inputManager.value = null
            }
            _isPlaying.value = false
            removeEventListeners()
        }
    }

    return {
        sceneManager,
        container,
        isPlaying,
        inputManager,
        initializeSceneManager,
        play,
        pause,
        destroy
    }
})

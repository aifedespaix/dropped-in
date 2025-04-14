import { defineStore } from 'pinia'
import { ref, shallowRef, computed, onMounted, onUnmounted } from 'vue'
import { SceneManager } from '~/lib/three/Scenes/SceneManager'
import { InputManager } from '~/lib/three/Input/InputManager'

export const useGameStore = defineStore('game', () => {
    const sceneManager = shallowRef<SceneManager | null>(null)
    const container = ref<HTMLElement | null>(null)
    const _isPlaying = ref(false)
    const inputManager = shallowRef<InputManager | null>(null)

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
            console.warn('Pointer lock error:', error)
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

        try {
            // D'abord demander le fullscreen
            const fullscreenSuccess = await requestFullscreen()
            if (!fullscreenSuccess) {
                console.warn('Failed to enter fullscreen mode')
                return
            }

            // Attendre un peu que le fullscreen soit bien appliqué
            await new Promise(resolve => setTimeout(resolve, 100))

            // Puis demander le pointer lock
            const pointerLockSuccess = await requestPointerLock()
            if (!pointerLockSuccess) {
                console.warn('Failed to lock pointer')
                // Si le pointer lock échoue, on sort du fullscreen
                pause()
                return
            }

            _isPlaying.value = true
            console.log('Game started in fullscreen with pointer lock')
        } catch (error) {
            console.error('Error starting game:', error)
            pause()
        }
    }

    const pause = () => {
        _isPlaying.value = false

        // Sortir du pointer lock
        if (document.pointerLockElement) {
            document.exitPointerLock()
        }

        // Sortir du fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen()
        }

        console.log('Game paused, exited fullscreen and pointer lock')
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

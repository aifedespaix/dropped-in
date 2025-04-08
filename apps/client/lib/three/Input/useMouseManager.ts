import { ref } from 'vue'
import { MouseManager } from './MouseManager'
import type { CharacterAction } from '../types/CharacterActions'

const mouseManager = ref<MouseManager | null>(null)

export function useMouseManager() {
    const initMouseManager = (callback: (action: CharacterAction, eventType: 'start' | 'stop') => void) => {
        if (!mouseManager.value) {
            mouseManager.value = new MouseManager(callback)
        }
        return mouseManager.value
    }

    const destroyMouseManager = () => {
        if (mouseManager.value) {
            mouseManager.value.destroy()
            mouseManager.value = null
        }
    }

    return {
        mouseManager,
        initMouseManager,
        destroyMouseManager
    }
} 
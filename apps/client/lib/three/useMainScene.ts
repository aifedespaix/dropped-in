import { ref } from 'vue'
import { MainScene } from './Scenes/MainScene'

const mainScene = ref<MainScene | null>(null)

export function useMainScene() {
    const initScene = (container: HTMLElement) => {
        if (!mainScene.value) {
            mainScene.value = new MainScene(container)
            mainScene.value.animate()
        }
        return mainScene.value
    }

    const destroyScene = () => {
        if (mainScene.value) {
            mainScene.value.cleanup()
            mainScene.value = null
        }
    }

    return {
        mainScene,
        initScene,
        destroyScene
    }
} 
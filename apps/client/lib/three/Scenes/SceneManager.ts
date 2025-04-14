import { MainScene } from './MainScene'

export class SceneManager {
    private container: HTMLElement
    private mainScene: MainScene

    constructor(container: HTMLElement) {
        this.container = container
        this.mainScene = new MainScene(this.container)
    }

    async start() {
        try {
            console.log('Starting scene manager initialization...')
            await this.mainScene.init()
            console.log('Scene manager initialized successfully')
            this.mainScene.animate()
        } catch (error) {
            console.error('Failed to initialize scene manager:', error)
            throw error
        }
    }

    destroy() {
        this.mainScene.cleanup()
    }
}

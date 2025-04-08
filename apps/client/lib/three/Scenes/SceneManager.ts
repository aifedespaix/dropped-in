import { MainScene } from './MainScene'

export class SceneManager {
    private container: HTMLElement
    private mainScene: MainScene

    constructor(container: HTMLElement) {
        this.container = container
        this.mainScene = new MainScene(this.container)
    }

    start() {
        this.mainScene.init()
        this.mainScene.animate()
    }

    destroy() {
        // Nettoyage si nécessaire
    }
}

import { GameEngine } from './GameEngine/GameEngine'

export class Game {
    private gameEngine: GameEngine
    private container: HTMLElement

    constructor(container: HTMLElement) {
        this.container = container
        this.gameEngine = new GameEngine(container)
        this.init()
    }

    private async init() {
        try {
            // Attendre l'initialisation du moteur de jeu
            await this.gameEngine.waitForInit()

            // Démarrer l'animation
            this.gameEngine.animate()

            console.log('Game initialized successfully')
        } catch (error) {
            console.error('Failed to initialize game:', error)
            throw error
        }
    }

    public cleanup(): void {
        this.gameEngine.cleanup()
    }
} 
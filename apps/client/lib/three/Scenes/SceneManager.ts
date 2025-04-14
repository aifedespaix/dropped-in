import { GameEngine } from '../GameEngine/GameEngine'

/**
 * Gestionnaire de scène
 * Orchestre l'initialisation et la gestion de la scène principale
 */
export class SceneManager {
    private container: HTMLElement
    private gameEngine: GameEngine
    private isInitialized = false

    constructor(container: HTMLElement) {
        this.container = container
        this.gameEngine = new GameEngine(this.container)
    }

    /**
     * Démarre le gestionnaire de scène
     * Attend que la scène soit initialisée
     */
    async start() {
        try {
            console.log('Starting scene manager initialization...')

            // Initialiser le moteur de jeu
            console.log('Initializing game engine...')
            await this.gameEngine.waitForInit()
            console.log('Game engine initialized successfully')

            // Démarrer l'animation
            this.gameEngine.animate()

            this.isInitialized = true
            console.log('Scene manager initialized successfully')
        } catch (error) {
            console.error('Failed to start scene manager:', error)
            throw error
        }
    }

    /**
     * Met à jour la scène
     * @param deltaTime Temps écoulé depuis la dernière mise à jour
     */
    public update(deltaTime: number): void {
        if (!this.isInitialized) return
        this.gameEngine.update(deltaTime)
    }

    /**
     * Nettoie les ressources du gestionnaire de scène
     */
    destroy() {
        if (this.gameEngine) {
            this.gameEngine.cleanup()
        }
    }

    /**
     * Récupère le moteur de jeu
     */
    public getGameEngine(): GameEngine {
        return this.gameEngine
    }
}

import { GameEngine } from './three/GameEngine/GameEngine'
import { SceneManager } from './three/Scenes/SceneManager'

/**
 * Classe principale du jeu
 * Point d'entrée qui coordonne le moteur de jeu et le gestionnaire de scène
 */
export class Game {
    private gameEngine: GameEngine
    private sceneManager: SceneManager
    private container: HTMLElement
    private isInitialized = false

    /**
     * Crée une nouvelle instance du jeu
     * @param container Conteneur HTML pour le rendu
     */
    constructor(container: HTMLElement) {
        this.container = container
        this.gameEngine = new GameEngine()
        this.sceneManager = new SceneManager(container)
    }

    /**
     * Initialise le jeu
     * Attend que le moteur de jeu et le gestionnaire de scène soient initialisés
     */
    public async init(): Promise<void> {
        try {
            console.log('Initializing game...')

            // Initialiser le moteur de jeu
            await this.gameEngine.waitForInit()
            console.log('Game engine initialized')

            // Configurer le gestionnaire de scène avec le moteur de jeu
            this.sceneManager.setGameEngine(this.gameEngine)

            // Initialiser le gestionnaire de scène
            await this.sceneManager.start()
            console.log('Scene manager initialized')

            this.isInitialized = true
            console.log('Game initialized successfully')
        } catch (error) {
            console.error('Failed to initialize game:', error)
            throw error
        }
    }

    /**
     * Démarre le jeu
     */
    public start(): void {
        if (!this.isInitialized) {
            console.warn('Game not initialized yet')
            return
        }

        console.log('Starting game...')
        this.sceneManager.startAnimation()
    }

    /**
     * Met à jour le jeu
     * @param deltaTime Temps écoulé depuis la dernière mise à jour
     */
    public update(deltaTime: number): void {
        if (!this.isInitialized) return

        // Mettre à jour le moteur de jeu
        this.gameEngine.update(deltaTime)
    }

    /**
     * Nettoie les ressources du jeu
     */
    public cleanup(): void {
        console.log('Cleaning up game resources...')
        this.sceneManager.destroy()
        this.gameEngine.cleanup()
    }

    /**
     * Récupère le moteur de jeu
     */
    public getGameEngine(): GameEngine {
        return this.gameEngine
    }

    /**
     * Récupère le gestionnaire de scène
     */
    public getSceneManager(): SceneManager {
        return this.sceneManager
    }
} 
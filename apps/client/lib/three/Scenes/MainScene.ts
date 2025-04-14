import * as THREE from 'three'
import { MainRenderer } from '../Renderers/MainRenderer'
import { MainCamera } from '../Cameras/MainCamera'
import { SceneLighting } from '../Lighting/SceneLighting'
import { GameEngine } from '../GameEngine/GameEngine'

/**
 * Scène principale du jeu
 * Gère le rendu 3D et utilise GameEngine pour la logique du jeu
 */
export class MainScene extends THREE.Scene {
    private camera!: THREE.PerspectiveCamera
    private mainCamera!: MainCamera
    private renderer!: THREE.WebGLRenderer
    private container: HTMLElement
    private gameEngine: GameEngine | null = null
    private isInitialized = false
    private initPromise: Promise<void>
    private clock: THREE.Clock
    private animationFrameId: number | null = null
    private sceneLighting: SceneLighting
    private lastLoggedPosition: THREE.Vector3 | null = null
    private lastLoggedRotation: THREE.Euler | null = null
    private logCounter = 0

    constructor(container: HTMLElement) {
        super()
        this.container = container
        this.clock = new THREE.Clock()
        this.sceneLighting = new SceneLighting()
        this.initPromise = this.init()
    }

    /**
     * Configure le moteur de jeu pour la scène
     * @param gameEngine Moteur de jeu à utiliser
     */
    public setGameEngine(gameEngine: GameEngine): void {
        this.gameEngine = gameEngine
    }

    /**
     * Initialise la scène principale
     * @private
     */
    private async init(): Promise<void> {
        try {
            // Créer le renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true })
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.container.appendChild(this.renderer.domElement)

            // Configurer la scène
            this.background = new THREE.Color(0x87ceeb) // Ciel bleu

            // Créer la caméra
            this.camera = new THREE.PerspectiveCamera(
                75,
                this.container.clientWidth / this.container.clientHeight,
                0.1,
                1000
            )
            this.camera.position.set(0, 5, 10)
            this.camera.lookAt(0, 0, 0)

            // Initialiser la caméra principale
            this.mainCamera = new MainCamera(this.container)
            this.mainCamera.updatePosition(this.camera.position)

            // Ajouter des lumières
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
            this.add(ambientLight)

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            directionalLight.position.set(5, 10, 7.5)
            this.add(directionalLight)

            // Gérer le redimensionnement
            window.addEventListener('resize', this.onWindowResize.bind(this))

            // Configurer l'éclairage
            this.sceneLighting.setup(this)

            // Ajouter les objets du jeu à la scène
            if (this.gameEngine) {
                const floor = this.gameEngine.getFloor()
                const character = this.gameEngine.getCharacter()

                if (floor && floor.getMesh()) {
                    console.log('Adding floor to scene:', floor.getMesh())
                    this.add(floor.getMesh())
                }

                if (character && character.getMesh()) {
                    console.log('Adding character to scene:', character.getMesh())
                    this.add(character.getMesh())
                }

                // Le CharacterController est maintenant géré par le GameEngine
                // Pas besoin d'appeler setupCharacterController
            }

            this.isInitialized = true
            console.log('Scene initialized successfully')
        } catch (error) {
            console.error('Failed to initialize main scene:', error)
            throw error
        }
    }

    /**
     * Attend que la scène soit initialisée
     */
    public async waitForInit(): Promise<void> {
        return this.initPromise
    }

    /**
     * Gère le redimensionnement de la fenêtre
     * @private
     */
    private onWindowResize(): void {
        if (!this.isInitialized) return

        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    }

    /**
     * Démarre l'animation de la scène
     */
    public animate(): void {
        if (!this.isInitialized) {
            console.warn('Main scene not initialized yet')
            return
        }

        const deltaTime = this.clock.getDelta()
        this.update(deltaTime)
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this))
    }

    /**
     * Met à jour la scène
     * @param deltaTime Temps écoulé depuis la dernière mise à jour
     */
    public update(deltaTime: number): void {
        if (!this.isInitialized) return

        // Mettre à jour le moteur de jeu si disponible
        if (this.gameEngine) {
            this.gameEngine.update(deltaTime)

            // Log de la position et orientation (toutes les 60 frames)
            if (this.logCounter % 60 === 0) {
                const character = this.gameEngine.getCharacter()
                const position = character?.getPosition()
                const rotation = this.camera.rotation
                console.log(`Pos: x:${position?.x.toFixed(2)} y:${position?.y.toFixed(2)} z:${position?.z.toFixed(2)} | Cam: x:${(rotation.x * 180 / Math.PI).toFixed(2)}° y:${(rotation.y * 180 / Math.PI).toFixed(2)}° z:${(rotation.z * 180 / Math.PI).toFixed(2)}°`)
            }

            this.logCounter++
        }

        // Rendre la scène
        this.renderer.render(this, this.camera)
    }

    /**
     * Nettoie les ressources de la scène
     */
    public cleanup(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId)
            this.animationFrameId = null
        }

        window.removeEventListener('resize', this.onWindowResize.bind(this))

        if (this.gameEngine) {
            this.gameEngine.cleanup()
        }

        this.renderer.dispose()
        this.container.removeChild(this.renderer.domElement)
    }

    /**
     * Récupère la scène Three.js
     */
    public getScene(): THREE.Scene {
        return this
    }

    /**
     * Récupère la caméra
     */
    public getCamera(): THREE.PerspectiveCamera {
        return this.camera
    }

    /**
     * Récupère le renderer
     */
    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer
    }

    /**
     * Récupère le conteneur HTML
     */
    public getContainer(): HTMLElement {
        return this.container
    }
}

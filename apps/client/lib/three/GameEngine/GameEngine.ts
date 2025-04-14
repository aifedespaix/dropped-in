import { PhysicsEngine } from '../../rapier/PhysicsEngine'
import { Map } from '../Objects/Map'
import { Floor } from '../Objects/Floor'
import { Character } from '../Objects/Character'
import { CharacterController } from '../Controllers/CharacterController'
import * as THREE from 'three'
import { MainCamera } from '../Cameras/MainCamera'
import { SceneLighting } from '../Lighting/SceneLighting'

/**
 * Moteur de jeu qui gère la logique du jeu (objets, physique, interactions)
 * Séparé du moteur de rendu (MainScene) pour une meilleure architecture
 */
export class GameEngine {
    private physicsEngine: PhysicsEngine
    private map: Map
    private floor!: Floor
    private character!: Character
    private characterController!: CharacterController
    private isInitialized = false
    private initPromise: Promise<void>
    private scene!: THREE.Scene
    private renderer!: THREE.WebGLRenderer
    private camera!: THREE.PerspectiveCamera
    private mainCamera!: MainCamera
    private container: HTMLElement
    private sceneLighting: SceneLighting
    private clock: THREE.Clock
    private animationFrameId: number | null = null

    constructor(container: HTMLElement) {
        this.container = container
        this.physicsEngine = new PhysicsEngine()
        this.map = new Map()
        this.clock = new THREE.Clock()
        this.sceneLighting = new SceneLighting()
        this.initPromise = this.init()
    }

    /**
     * Initialise le moteur de jeu
     * @private
     */
    private async init() {
        try {
            // Attendre l'initialisation du moteur physique
            await this.physicsEngine.waitForInit()

            // Créer le renderer avec des options spécifiques
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                powerPreference: 'high-performance',
                stencil: false,
                depth: true,
                alpha: true,
                preserveDrawingBuffer: true
            })
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
            this.renderer.setPixelRatio(window.devicePixelRatio)
            this.renderer.shadowMap.enabled = true
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
            this.container.appendChild(this.renderer.domElement)

            // Configurer la scène
            this.scene = new THREE.Scene()
            this.scene.background = new THREE.Color(0x87ceeb) // Ciel bleu

            // Initialiser la caméra principale
            this.mainCamera = new MainCamera(this.container)
            this.camera = this.mainCamera.getCamera() // Utiliser la caméra de MainCamera

            // Ajouter des lumières
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
            this.scene.add(ambientLight)

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            directionalLight.position.set(5, 10, 7.5)
            this.scene.add(directionalLight)

            // Configurer l'éclairage
            this.sceneLighting.setup(this.scene)

            // Créer le sol
            this.floor = new Floor(this.physicsEngine)
            const floorMesh = this.floor.getMesh()
            if (floorMesh) {
                this.scene.add(floorMesh)
            }

            // Créer le personnage
            this.character = new Character()
            await this.character.loadFromGLTF('/models/character.glb')
            const characterMesh = this.character.getMesh()
            if (characterMesh) {
                this.scene.add(characterMesh)
            }

            // Créer le contrôleur de personnage
            this.characterController = new CharacterController(
                this.character,
                this.mainCamera,
                this.container
            )
            this.characterController.init()

            // Gérer le redimensionnement
            window.addEventListener('resize', this.onWindowResize.bind(this))

            this.isInitialized = true
            console.log('GameEngine initialized successfully')
        } catch (error) {
            console.error('Failed to initialize game engine:', error)
            throw error
        }
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
     * Démarre l'animation
     */
    public animate(): void {
        if (!this.isInitialized) {
            console.warn('Game engine not initialized yet')
            return
        }

        const deltaTime = this.clock.getDelta()
        this.update(deltaTime)
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this))
    }

    /**
     * Met à jour la logique du jeu
     * @param deltaTime - Temps écoulé depuis la dernière mise à jour
     */
    public update(deltaTime: number): void {
        if (!this.isInitialized) {
            console.warn('Game engine not initialized yet')
            return
        }

        // Mettre à jour la physique avec un deltaTime fixe pour plus de stabilité
        const fixedDeltaTime = 1 / 60
        this.physicsEngine.update(fixedDeltaTime)

        // Mettre à jour le personnage
        if (this.character && this.character.canMove()) {
            this.character.update(deltaTime)
        }

        // Mettre à jour le contrôleur de personnage
        if (this.characterController) {
            this.characterController.update(deltaTime)
        }

        // Rendre la scène
        if (this.scene && this.camera && this.renderer) {
            // Forcer la mise à jour des matrices de la caméra
            this.camera.updateMatrix()
            this.camera.updateMatrixWorld(true)

            // Forcer la mise à jour de la matrice de vue
            this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert()

            // Forcer la mise à jour des matrices de la scène
            this.scene.updateMatrixWorld(true)

            // Rendre la scène
            this.renderer.render(this.scene, this.camera)
        }
    }

    /**
     * Attend que le moteur de jeu soit complètement initialisé
     * @returns Promise qui se résout une fois l'initialisation terminée
     */
    public async waitForInit(): Promise<void> {
        return this.initPromise
    }

    // Getters pour les objets du jeu
    public getCharacter(): Character {
        return this.character
    }

    public getFloor(): Floor {
        return this.floor
    }

    public getMap(): Map {
        return this.map
    }

    public getPhysicsEngine(): PhysicsEngine {
        return this.physicsEngine
    }

    public getCharacterController(): CharacterController {
        return this.characterController
    }

    public getScene(): THREE.Scene {
        return this.scene
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera
    }

    public getRenderer(): THREE.WebGLRenderer {
        return this.renderer
    }

    /**
     * Nettoie les ressources du moteur de jeu
     */
    public cleanup(): void {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId)
            this.animationFrameId = null
        }

        window.removeEventListener('resize', this.onWindowResize.bind(this))

        if (this.characterController) {
            this.characterController.cleanup()
        }
        if (this.character && this.character.physicsObject) {
            this.character.physicsObject.dispose()
        }
        if (this.floor && this.floor.getPhysicsObject()) {
            this.floor.getPhysicsObject().dispose()
        }

        this.renderer.dispose()
        this.container.removeChild(this.renderer.domElement)
    }
} 
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Camera } from 'three'
import { Cube } from '../Objects/Cube'
import { Door } from '../Objects/Door'
import { Map } from '../Objects/Map'
import { Character } from '../Objects/Character'
import { MainRenderer } from '../Renderers/MainRenderer'
import { MainCamera } from '../Cameras/MainCamera'
import { CharacterController } from '../Controllers/CharacterController'
import { PhysicsObject } from '../../rapier/PhysicsObject'
import { PhysicsEngine } from '../../rapier/PhysicsEngine'
import * as RAPIER from '@dimforge/rapier3d-compat'
import { GLTFObjectType } from '../Utils/GLTFLoader'
import { Floor } from '../Objects/Floor'

export class MainScene extends THREE.Scene {
    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera
    private mainCamera: MainCamera
    private renderer: MainRenderer
    private container: HTMLElement
    private map: Map = new Map()
    private light: THREE.DirectionalLight = new THREE.DirectionalLight(0xffffff, 1)
    private ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x404040, 2)
    private physicsEngine: PhysicsEngine
    private isInitialized = false
    private floor!: Floor
    private character!: Character
    private characterController!: CharacterController

    constructor(container: HTMLElement) {
        super()
        this.container = container
        this.scene = this
        this.mainCamera = new MainCamera(container)
        this.camera = this.mainCamera.getCamera()
        this.renderer = new MainRenderer(this.container)
        this.physicsEngine = new PhysicsEngine()
    }

    private async init() {
        try {
            // Attendre l'initialisation du moteur physique
            await this.physicsEngine.waitForInit()

            // Configurer l'éclairage
            this.light.position.set(5, 10, 7.5)
            this.light.castShadow = true
            this.add(this.light)
            this.add(this.ambientLight)

            // Créer le sol
            this.floor = new Floor(this.physicsEngine)
            this.add(this.floor.getMesh())

            // Initialiser et charger le personnage
            this.character = new Character()
            await this.character.loadFromGLTF('/models/character.glb')
            this.add(this.character.getMesh())

            // Initialiser le contrôleur après que le personnage soit chargé
            this.characterController = new CharacterController(this.character, this.mainCamera, this.container)
            this.characterController.init()

            this.isInitialized = true
        } catch (error) {
            console.error('Failed to initialize scene:', error)
            throw error
        }
    }

    public update(deltaTime: number): void {
        if (!this.isInitialized) {
            console.warn('Scene not initialized yet')
            return
        }

        // Mettre à jour la physique avec un deltaTime fixe pour plus de stabilité
        const fixedDeltaTime = 1 / 60
        this.physicsEngine.update(fixedDeltaTime)

        // Mettre à jour les objets seulement si nécessaire
        if (this.character && this.character.canMove()) {
            this.character.update(deltaTime)

            // Mettre à jour la position de la caméra seulement si le personnage a bougé
            const position = this.character.getPosition()
            if (position.distanceTo(this.mainCamera.getPosition()) > 0.01) {
                this.mainCamera.updatePosition(position)
            }
        }

        // Mettre à jour le rendu
        this.renderer.render(this.scene, this.camera)
    }

    public animate = () => {
        requestAnimationFrame(this.animate)
        const deltaTime = 1 / 60 // Temps fixe pour l'instant
        this.update(deltaTime)
    }

    cleanup() {
        if (this.characterController) {
            this.characterController.cleanup()
        }
        if (this.renderer) {
            this.renderer.cleanup()
        }
        if (this.character && this.character.physicsObject) {
            this.character.physicsObject.dispose()
        }
        if (this.floor && this.floor.getPhysicsObject()) {
            this.floor.getPhysicsObject().dispose()
        }
    }
}

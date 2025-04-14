import { Character } from '../Objects/Character'
import { InputManager } from '../Input/InputManager'
import * as THREE from 'three'
import type { CharacterAction } from '../types/CharacterActions'
import { MainCamera } from '../Cameras/MainCamera'
import { MouseManager } from '../Input/MouseManager'
import { KeyboardManager } from '../Input/KeyboardManager'

/**
 * Contrôleur du personnage
 * Gère les entrées utilisateur et les applique au personnage
 */
export class CharacterController {
    private character: Character
    private inputManager: InputManager
    private moveDirection = new THREE.Vector3()
    private isInitialized = false
    private camera: MainCamera
    private verticalRotation = 0
    private horizontalRotation = 0
    private readonly MAX_VERTICAL_ANGLE = Math.PI / 2 // 90 degrés
    private readonly MIN_VERTICAL_ANGLE = -Math.PI / 2 // -90 degrés
    private isPointerLocked = false
    private gameContainer: HTMLElement
    private mainCamera: MainCamera
    private container: HTMLElement
    private mouseManager: MouseManager
    private moveSpeed: number = 5
    private rotationSpeed: number = 0.002

    /**
     * Crée un nouveau contrôleur de personnage
     * @param character - Le personnage à contrôler
     * @param mainCamera - La caméra à contrôler
     * @param container - Le conteneur du jeu
     */
    constructor(character: Character, mainCamera: MainCamera, container: HTMLElement) {
        this.character = character
        this.mainCamera = mainCamera
        this.container = container
        this.gameContainer = container
        this.inputManager = InputManager.getInstance()
        this.mouseManager = new MouseManager((action: CharacterAction, eventType: 'start' | 'stop') => {
            // Les événements de la souris sont gérés directement par le CharacterController
            const state = eventType === 'start'
            switch (action) {
                case 'forward':
                    this.moveDirection.z = state ? -1 : 0
                    break
                case 'backward':
                    this.moveDirection.z = state ? 1 : 0
                    break
                case 'left':
                    this.moveDirection.x = state ? -1 : 0
                    break
                case 'right':
                    this.moveDirection.x = state ? 1 : 0
                    break
                case 'jump':
                    if (state) {
                        this.moveDirection.y = 1
                        this.updateMovement()
                        this.moveDirection.y = 0
                    }
                    break
            }
            this.updateMovement()
        })
        this.horizontalRotation = 0
        this.verticalRotation = 0
        this.moveSpeed = 5
        this.rotationSpeed = 0.002
        this.isPointerLocked = false

        // Attacher la caméra au personnage
        const characterMesh = this.character.getMesh()
        if (characterMesh) {
            characterMesh.add(this.mainCamera.getCamera())
            // Positionner la caméra à la hauteur des yeux
            this.mainCamera.getCamera().position.set(0, 1.7, 0)
        }
    }

    /**
     * Définit la caméra à utiliser
     * @param camera - La caméra à utiliser
     */
    public setCamera(camera: MainCamera): void {
        this.camera = camera
    }

    /**
     * Définit le conteneur du jeu
     * @param container - Le conteneur HTML
     */
    public setContainer(container: HTMLElement): void {
        this.gameContainer = container
    }

    public init(): void {
        console.log('Initializing CharacterController...')

        // Nettoyer les événements existants avant d'en ajouter de nouveaux
        this.cleanup()

        // Configurer les actions de mouvement
        this.inputManager.registerKeyboardEvent('forward', 'continuous', (state?: boolean) => {
            console.log('Forward:', state)
            this.moveDirection.z = state ? -1 : 0
            this.updateMovement()
        })
        this.inputManager.registerKeyboardEvent('backward', 'continuous', (state?: boolean) => {
            console.log('Backward:', state)
            this.moveDirection.z = state ? 1 : 0
            this.updateMovement()
        })
        this.inputManager.registerKeyboardEvent('left', 'continuous', (state?: boolean) => {
            console.log('Left:', state)
            this.moveDirection.x = state ? -1 : 0
            this.updateMovement()
        })
        this.inputManager.registerKeyboardEvent('right', 'continuous', (state?: boolean) => {
            console.log('Right:', state)
            this.moveDirection.x = state ? 1 : 0
            this.updateMovement()
        })
        this.inputManager.registerKeyboardEvent('jump', 'once', () => {
            console.log('Jump')
            this.moveDirection.y = 1
            this.updateMovement()
            this.moveDirection.y = 0
        })

        console.log('Setting up mouse events...')
        console.log('Game container:', this.gameContainer)

        // Gérer les mouvements de la souris et le pointer lock
        this.gameContainer.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('pointerlockchange', this.handlePointerLockChange)

        // Ne pas demander le pointer lock automatiquement
        // this.gameContainer.addEventListener('click', this.requestPointerLock)

        this.isInitialized = true
        console.log('CharacterController initialized')
    }

    private handlePointerLockChange = (): void => {
        this.isPointerLocked = document.pointerLockElement === this.gameContainer
        console.log('Pointer lock changed:', this.isPointerLocked)
    }

    private handleMouseMove = (event: MouseEvent): void => {
        if (!this.isPointerLocked) return

        const movementX = event.movementX || 0
        const movementY = event.movementY || 0

        // Rotation horizontale (personnage + caméra)
        this.horizontalRotation -= movementX * this.rotationSpeed
        const characterMesh = this.character.getMesh()
        if (characterMesh) {
            characterMesh.rotation.y = this.horizontalRotation
            characterMesh.updateMatrix()
            characterMesh.updateMatrixWorld(true)
        }

        // Rotation verticale (uniquement caméra)
        this.verticalRotation -= movementY * this.rotationSpeed
        this.verticalRotation = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.verticalRotation))
        const camera = this.mainCamera.getCamera()
        camera.rotation.x = this.verticalRotation
        camera.updateMatrix()
        camera.updateMatrixWorld(true)
    }

    private updateMovement(): void {
        if (this.moveDirection.length() > 0) {
            console.log('CharacterController - Initial move direction:', this.moveDirection.toArray());
            this.moveDirection.normalize();
            console.log('CharacterController - Normalized move direction:', this.moveDirection.toArray());

            // Appliquer la rotation horizontale au mouvement
            const rotatedDirection = this.moveDirection.clone();
            console.log('CharacterController - Horizontal rotation:', this.horizontalRotation);
            rotatedDirection.applyEuler(new THREE.Euler(0, this.horizontalRotation, 0));
            console.log('CharacterController - Rotated direction:', rotatedDirection.toArray());

            // Appliquer la vitesse
            rotatedDirection.multiplyScalar(this.moveSpeed);
            console.log('CharacterController - Final direction with speed:', rotatedDirection.toArray());

            if (this.character && this.character.canMove()) {
                console.log('CharacterController - Character can move, applying movement');
                this.character.move(rotatedDirection);
            } else {
                console.warn('CharacterController - Character cannot move:', {
                    characterExists: !!this.character,
                    canMove: this.character?.canMove()
                });
            }
        }
    }

    /**
     * Met à jour l'état du personnage
     */
    public update(deltaTime: number): void {
        if (!this.character || !this.character.canMove()) return
        this.updateMovement()
    }

    /**
     * Récupère la position du personnage
     */
    getPosition(): THREE.Vector3 {
        return this.character.mesh.position
    }

    /**
     * Nettoie les événements
     */
    public cleanup(): void {
        if (!this.isInitialized) return

        // Désenregistrer les actions
        this.inputManager.unregisterEvent('forward')
        this.inputManager.unregisterEvent('backward')
        this.inputManager.unregisterEvent('left')
        this.inputManager.unregisterEvent('right')
        this.inputManager.unregisterEvent('jump')

        // Supprimer les écouteurs d'événements
        document.removeEventListener('mousemove', this.handleMouseMove)
        document.removeEventListener('pointerlockchange', this.handlePointerLockChange)

        this.isInitialized = false
    }
}

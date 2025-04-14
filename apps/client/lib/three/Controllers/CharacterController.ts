import { Character } from '../Objects/Character'
import { InputManager } from '../Input/InputManager'
import * as THREE from 'three'
import type { CharacterAction } from '../types/CharacterActions'
import { MainCamera } from '../Cameras/MainCamera'

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

    /**
     * Crée un nouveau contrôleur de personnage
     * @param character - Le personnage à contrôler
     * @param camera - La caméra à contrôler
     * @param gameContainer - Le conteneur du jeu
     */
    constructor(character: Character, camera: MainCamera, gameContainer: HTMLElement) {
        this.character = character
        this.camera = camera
        this.gameContainer = gameContainer
        this.inputManager = InputManager.getInstance()
    }

    public init(): void {
        // Nettoyer les événements existants avant d'en ajouter de nouveaux
        this.cleanup()

        // Configurer les actions de mouvement
        this.inputManager.registerKeyboardEvent('forward', 'continuous', (state?: boolean) => {
            this.moveDirection.z = state ? -1 : 0
            this.updateMovement()
        })
        this.inputManager.registerKeyboardEvent('backward', 'continuous', (state?: boolean) => {
            this.moveDirection.z = state ? 1 : 0
            this.updateMovement()
        })
        this.inputManager.registerKeyboardEvent('left', 'continuous', (state?: boolean) => {
            this.moveDirection.x = state ? -1 : 0
            this.updateMovement()
        })
        this.inputManager.registerKeyboardEvent('right', 'continuous', (state?: boolean) => {
            this.moveDirection.x = state ? 1 : 0
            this.updateMovement()
        })
        this.inputManager.registerKeyboardEvent('jump', 'once', () => {
            this.moveDirection.y = 1
            this.updateMovement()
            this.moveDirection.y = 0
        })

        // Configurer les touches par défaut seulement si elles ne sont pas déjà mappées
        const keyboardManager = (this.inputManager as any).keyboardManager
        if (!keyboardManager.hasEvent('KeyW')) this.inputManager.mapKey('KeyW', 'forward')
        if (!keyboardManager.hasEvent('KeyS')) this.inputManager.mapKey('KeyS', 'backward')
        if (!keyboardManager.hasEvent('KeyA')) this.inputManager.mapKey('KeyA', 'left')
        if (!keyboardManager.hasEvent('KeyD')) this.inputManager.mapKey('KeyD', 'right')
        if (!keyboardManager.hasEvent('Space')) this.inputManager.mapKey('Space', 'jump')

        // Gérer les mouvements de la souris et le pointer lock
        document.addEventListener('mousemove', this.handleMouseMove)
        document.addEventListener('pointerlockchange', this.handlePointerLockChange)

        this.isInitialized = true
    }

    private handlePointerLockChange = (): void => {
        this.isPointerLocked = document.pointerLockElement === this.gameContainer
    }

    private handleMouseMove = (event: MouseEvent): void => {
        if (!this.isPointerLocked) return

        const movementX = event.movementX || 0
        const movementY = event.movementY || 0

        // Mettre à jour les rotations
        this.horizontalRotation += movementX * 0.003
        this.verticalRotation = Math.max(
            this.MIN_VERTICAL_ANGLE,
            Math.min(this.MAX_VERTICAL_ANGLE, this.verticalRotation - movementY * 0.003)
        )

        // Créer une matrice de rotation pour la caméra
        // D'abord la rotation horizontale
        const horizontalMatrix = new THREE.Matrix4()
        horizontalMatrix.makeRotationY(this.horizontalRotation)

        // Puis la rotation verticale
        const verticalMatrix = new THREE.Matrix4()
        verticalMatrix.makeRotationX(this.verticalRotation)

        // Combiner les rotations (d'abord horizontale, puis verticale)
        const rotationMatrix = new THREE.Matrix4()
        rotationMatrix.multiplyMatrices(horizontalMatrix, verticalMatrix)

        // Mettre à jour la rotation de la caméra
        this.camera.updateRotation(rotationMatrix)

        // Mettre à jour la rotation du personnage (uniquement horizontalement)
        const characterRotation = new THREE.Euler(0, this.horizontalRotation, 0)
        this.character.updateHorizontalRotation(characterRotation.y)
    }

    private updateMovement(): void {
        if (this.moveDirection.length() > 0) {
            this.moveDirection.normalize()

            // Appliquer la rotation horizontale au mouvement
            const rotatedDirection = this.moveDirection.clone()
            rotatedDirection.applyEuler(new THREE.Euler(0, this.horizontalRotation, 0))

            this.character.move(rotatedDirection)
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

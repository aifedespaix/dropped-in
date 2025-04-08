import { Character } from '../Objects/Character'
import { InputManager } from '../Input/InputManager'
import type { CharacterAction, CharacterActionState } from '../types/CharacterActions'
import { DEFAULT_ACTION_STATE } from '../types/CharacterActions'
import * as THREE from 'three'

/**
 * Contrôleur du personnage
 * Gère les entrées utilisateur et les applique au personnage
 */
export class CharacterController {
    private character: Character
    private inputManager: InputManager
    private actionState: CharacterActionState
    private mouseSensitivity = 0.002

    /**
     * Crée un nouveau contrôleur de personnage
     * @param character - Le personnage à contrôler
     */
    constructor(character: Character) {
        this.character = character
        this.inputManager = InputManager.getInstance()
        this.actionState = { ...DEFAULT_ACTION_STATE }

        this.setupKeyboardControls()
        this.setupMouseControls()
    }

    /**
     * Configure les contrôles clavier
     * @private
     */
    private setupKeyboardControls(): void {
        // Enregistrement des actions continues (mouvement)
        this.inputManager.registerKeyboardEvent('forward', 'continuous', (state) => {
            this.actionState.forward = state || false
        })

        this.inputManager.registerKeyboardEvent('backward', 'continuous', (state) => {
            this.actionState.backward = state || false
        })

        this.inputManager.registerKeyboardEvent('left', 'continuous', (state) => {
            this.actionState.left = state || false
        })

        this.inputManager.registerKeyboardEvent('right', 'continuous', (state) => {
            this.actionState.right = state || false
        })

        // Enregistrement de l'action de saut (une seule fois)
        this.inputManager.registerKeyboardEvent('jump', 'once', () => {
            this.actionState.jump = true
            // Réinitialiser l'état de saut après un court délai
            setTimeout(() => {
                this.actionState.jump = false
            }, 100)
        })
    }

    /**
     * Configure les contrôles souris
     * @private
     */
    private setupMouseControls(): void {
        // Gestion du mouvement de la souris
        document.addEventListener('mousemove', (event) => {
            if (document.pointerLockElement) {
                // Rotation horizontale (Y) - tourner le personnage
                this.character.mesh.rotation.y -= event.movementX * this.mouseSensitivity

                // Rotation verticale (X) - incliner la tête
                this.character.updateVerticalRotation(-event.movementY * this.mouseSensitivity)
            }
        })
    }

    /**
     * Met à jour l'état du contrôleur
     * Doit être appelé à chaque frame
     */
    public update(): void {
        // Appliquer les mouvements au personnage
        this.character.move(this.actionState)
    }

    /**
     * Récupère la position actuelle du personnage
     */
    public getPosition(): THREE.Vector3 {
        return this.character.mesh.position.clone()
    }

    /**
     * Nettoie les ressources
     */
    public cleanup(): void {
        // Désenregistrer les événements
        this.inputManager.unregisterEvent('forward')
        this.inputManager.unregisterEvent('backward')
        this.inputManager.unregisterEvent('left')
        this.inputManager.unregisterEvent('right')
        this.inputManager.unregisterEvent('jump')
    }
}

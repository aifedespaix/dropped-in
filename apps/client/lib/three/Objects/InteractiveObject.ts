import * as THREE from 'three'
import { GLTFObject } from './GLTFObject'
import { GLTFObjectType } from '../Utils/GLTFLoader'
import type { GLTFLoadOptions } from '../Utils/GLTFLoader'

/**
 * Type d'interaction possible avec un objet
 */
export enum InteractionType {
    PICKUP = 'pickup',
    USE = 'use',
    TOGGLE = 'toggle'
}

/**
 * Interface pour les options d'interaction
 */
export interface InteractionOptions {
    /**
     * Type d'interaction
     */
    type: InteractionType
    /**
     * Distance maximale pour interagir avec l'objet
     */
    maxDistance?: number
    /**
     * Si l'objet peut être ramassé
     */
    canBePickedUp?: boolean
    /**
     * Si l'objet est utilisable
     */
    isUsable?: boolean
    /**
     * Si l'objet peut être activé/désactivé
     */
    isToggleable?: boolean
    /**
     * État initial de l'objet (pour les objets toggleable)
     */
    initialState?: boolean
}

/**
 * Classe de base pour les objets interactifs
 */
export class InteractiveObject extends GLTFObject {
    protected interactionOptions: InteractionOptions
    protected isActive: boolean = false
    protected isPickedUp: boolean = false
    protected originalPosition: THREE.Vector3
    protected originalRotation: THREE.Euler
    protected originalScale: THREE.Vector3

    /**
     * Crée un nouvel objet interactif
     * @param interactionOptions Options d'interaction
     */
    constructor(interactionOptions: InteractionOptions) {
        super(GLTFObjectType.OBJECT)
        this.interactionOptions = interactionOptions
        this.originalPosition = new THREE.Vector3()
        this.originalRotation = new THREE.Euler()
        this.originalScale = new THREE.Vector3(1, 1, 1)
    }

    /**
     * Charge un objet à partir d'un fichier GLTF
     * @param url URL du fichier GLTF
     * @param options Options de chargement
     */
    public override async loadFromGLTF(url: string, options?: Partial<GLTFLoadOptions>): Promise<void> {
        const defaultOptions: GLTFLoadOptions = {
            type: GLTFObjectType.OBJECT,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1),
            addToScene: true,
            addToPhysics: true,
            mass: 1,
            lockRotation: false
        }

        const finalOptions = { ...defaultOptions, ...options }
        await super.loadFromGLTF(url, finalOptions)

        // Sauvegarder la position, rotation et échelle originales
        this.originalPosition.copy(this.mesh.position)
        this.originalRotation.copy(this.mesh.rotation)
        this.originalScale.copy(this.mesh.scale)

        // Initialiser l'état pour les objets toggleable
        if (this.interactionOptions.isToggleable) {
            this.isActive = this.interactionOptions.initialState || false
        }
    }

    /**
     * Interagit avec l'objet
     * @param playerPosition Position du joueur
     * @returns Si l'interaction a réussi
     */
    public interact(playerPosition: THREE.Vector3): boolean {
        // Vérifier la distance
        if (this.interactionOptions.maxDistance) {
            const distance = this.mesh.position.distanceTo(playerPosition)
            if (distance > this.interactionOptions.maxDistance) {
                return false
            }
        }

        // Gérer les différents types d'interaction
        switch (this.interactionOptions.type) {
            case InteractionType.PICKUP:
                return this.handlePickup()
            case InteractionType.USE:
                return this.handleUse()
            case InteractionType.TOGGLE:
                return this.handleToggle()
            default:
                return false
        }
    }

    /**
     * Gère l'interaction de type "ramasser"
     * @private
     */
    private handlePickup(): boolean {
        if (!this.interactionOptions.canBePickedUp) return false

        this.isPickedUp = !this.isPickedUp
        return true
    }

    /**
     * Gère l'interaction de type "utiliser"
     * @private
     */
    private handleUse(): boolean {
        if (!this.interactionOptions.isUsable) return false

        // Logique spécifique à l'utilisation de l'objet
        // À implémenter dans les classes dérivées
        return true
    }

    /**
     * Gère l'interaction de type "basculer"
     * @private
     */
    private handleToggle(): boolean {
        if (!this.interactionOptions.isToggleable) return false

        this.isActive = !this.isActive
        return true
    }

    /**
     * Ramasse l'objet
     * @param position Position où placer l'objet
     */
    public pickUp(position: THREE.Vector3): void {
        if (!this.interactionOptions.canBePickedUp) return

        this.mesh.position.copy(position)
        if (this.physicsObject) {
            this.physicsObject.setPosition(position)
        }
    }

    /**
     * Relâche l'objet
     */
    public drop(): void {
        if (!this.interactionOptions.canBePickedUp) return

        this.mesh.position.copy(this.originalPosition)
        if (this.physicsObject) {
            this.physicsObject.setPosition(this.originalPosition)
        }
    }

    /**
     * Réinitialise l'objet à son état d'origine
     */
    public reset(): void {
        this.mesh.position.copy(this.originalPosition)
        this.mesh.rotation.copy(this.originalRotation)
        this.mesh.scale.copy(this.originalScale)
        this.isActive = this.interactionOptions.initialState || false
        this.isPickedUp = false

        if (this.physicsObject) {
            this.physicsObject.setPosition(this.originalPosition)
            this.physicsObject.setRotation(this.originalRotation)
        }
    }

    /**
     * Vérifie si l'objet est actif
     */
    public isActiveState(): boolean {
        return this.isActive
    }

    /**
     * Vérifie si l'objet est ramassé
     */
    public isPickedUpState(): boolean {
        return this.isPickedUp
    }

    /**
     * Met à jour l'objet
     * @param deltaTime Temps écoulé depuis la dernière mise à jour
     */
    public override update(deltaTime: number): void {
        super.update(deltaTime)
    }
} 
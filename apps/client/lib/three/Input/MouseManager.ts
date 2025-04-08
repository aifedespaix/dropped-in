import type { CharacterAction } from "../types/CharacterActions"

/**
 * Type de bouton de souris
 */
export type MouseButton = 'left' | 'middle' | 'right' | 'back' | 'next'

/**
 * Type de callback pour les événements souris
 */
export type MouseCallback = (action: CharacterAction, eventType: EventType) => void

/**
 * Map des événements souris
 */
export type MouseEvents = Map<MouseButton, CharacterAction>

/**
 * Type d'événement possible
 */
export type EventType = 'start' | 'stop'

/**
 * Gestionnaire des événements souris
 * Responsable de la capture et du routage des événements de clic
 */
export class MouseManager {
    private events: MouseEvents = new Map()
    private callback: MouseCallback
    private isDestroyed = false

    /**
     * Crée une nouvelle instance de MouseManager
     * @param callback - Fonction appelée lors d'un événement souris
     * @param events - Map optionnelle d'événements personnalisés
     */
    constructor(callback: MouseCallback, events?: MouseEvents) {
        this.callback = callback
        if (events) {
            this.events = new Map(events)
        } else {
            this.setupDefaultEvents()
        }
        this.setupMouseListeners()
    }

    /**
     * Configure les événements par défaut
     * @private
     */
    private setupDefaultEvents(): void {
        // this.addEvent('left', 'forward')
        // this.addEvent('right', 'backward')
        // this.addEvent('middle', 'jump')
        // this.addEvent('back', 'left')
        // this.addEvent('next', 'right')
    }

    /**
     * Convertit le code de bouton de souris en type MouseButton
     * @private
     */
    private getMouseButtonFromCode(code: number): MouseButton | undefined {
        switch (code) {
            case 0: return 'left'
            case 1: return 'middle'
            case 2: return 'right'
            case 3: return 'back'
            case 4: return 'next'
            default: return undefined
        }
    }

    /**
     * Ajoute un nouvel événement
     * @param button - Bouton de souris
     * @param action - Action associée
     * @throws Error si le bouton est déjà enregistré
     */
    public addEvent(button: MouseButton, action: CharacterAction): void {
        if (this.events.has(button)) {
            throw new Error(`Le bouton "${button}" est déjà enregistré`)
        }
        this.events.set(button, action)
    }

    /**
     * Supprime un événement
     * @param button - Bouton de souris à supprimer
     */
    public removeEvent(button: MouseButton): void {
        this.events.delete(button)
    }

    /**
     * Configure les écouteurs d'événements souris
     * @private
     */
    private setupMouseListeners(): void {
        window.addEventListener('mousedown', this.handleMouseDown)
        window.addEventListener('mouseup', this.handleMouseUp)
    }

    /**
     * Gère l'événement mousedown
     * @private
     */
    private handleMouseDown = (event: MouseEvent): void => {
        if (this.isDestroyed) return

        const button = this.getMouseButtonFromCode(event.button)
        if (button) {
            // Empêcher la navigation par défaut pour les boutons back/next
            if (button === 'back' || button === 'next') {
                event.preventDefault()
            }

            const action = this.events.get(button)
            if (action) {
                this.callback(action, 'start')
            }
        }
    }

    /**
     * Gère l'événement mouseup
     * @private
     */
    private handleMouseUp = (event: MouseEvent): void => {
        if (this.isDestroyed) return

        const button = this.getMouseButtonFromCode(event.button)
        if (button) {
            // Empêcher la navigation par défaut pour les boutons back/next
            if (button === 'back' || button === 'next') {
                event.preventDefault()
            }

            const action = this.events.get(button)
            if (action) {
                this.callback(action, 'stop')
            }
        }
    }

    /**
     * Nettoie les ressources et supprime les écouteurs d'événements
     */
    public destroy(): void {
        if (this.isDestroyed) return

        window.removeEventListener('mousedown', this.handleMouseDown)
        window.removeEventListener('mouseup', this.handleMouseUp)
        this.events.clear()
        this.isDestroyed = true
    }

    /**
     * Vérifie si un bouton est enregistré
     * @param button - Bouton de souris à vérifier
     */
    public hasEvent(button: MouseButton): boolean {
        return this.events.has(button)
    }

    /**
     * Récupère l'action associée à un bouton
     * @param button - Bouton de souris
     */
    public getAction(button: MouseButton): CharacterAction | undefined {
        return this.events.get(button)
    }
} 
import type { CharacterAction } from "../types/CharacterActions"

/**
 * Code de touche standardisé
 */
export type KeyCode = string

/**
 * Type de callback pour les événements clavier
 */
export type KeyboardCallback = (action: CharacterAction, eventType: EventType) => void

/**
 * Map des événements clavier
 */
export type KeyboardEvents = Map<KeyCode, CharacterAction>

/**
 * Type d'événement possible
 */
export type EventType = 'start' | 'stop'

/**
 * Gestionnaire des événements clavier
 * Responsable de la capture et du routage des événements clavier
 */
export class KeyboardManager {
    private events: KeyboardEvents = new Map()
    private callback: KeyboardCallback
    private isDestroyed = false

    /**
     * Crée une nouvelle instance de KeyboardManager
     * @param callback - Fonction appelée lors d'un événement clavier
     * @param events - Map optionnelle d'événements personnalisés
     */
    constructor(callback: KeyboardCallback, events?: KeyboardEvents) {
        this.callback = callback
        if (events) {
            this.events = new Map(events)
        } else {
            this.setupDefaultEvents()
        }
        this.setupKeyListeners()
    }

    /**
     * Configure les événements par défaut
     * @private
     */
    private setupDefaultEvents(): void {
        this.addEvent('KeyW', 'forward')
        this.addEvent('KeyS', 'backward')
        this.addEvent('KeyA', 'left')
        this.addEvent('KeyD', 'right')
        this.addEvent('Space', 'jump')
    }

    /**
     * Ajoute un nouvel événement
     * @param key - Code de la touche
     * @param action - Action associée
     * @throws Error si la touche est déjà enregistrée
     */
    public addEvent(key: KeyCode, action: CharacterAction): void {
        if (this.events.has(key)) {
            throw new Error(`La touche "${key}" est déjà enregistrée`)
        }
        this.events.set(key, action)
    }

    /**
     * Supprime un événement
     * @param key - Code de la touche à supprimer
     */
    public removeEvent(key: KeyCode): void {
        this.events.delete(key)
    }

    /**
     * Configure les écouteurs d'événements clavier
     * @private
     */
    private setupKeyListeners(): void {
        window.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('keyup', this.handleKeyUp)
    }

    /**
     * Gère l'événement keydown
     * @private
     */
    private handleKeyDown = (event: KeyboardEvent): void => {
        if (this.isDestroyed) return

        const action = this.events.get(event.code)
        if (action) {
            this.callback(action, 'start')
        }
    }

    /**
     * Gère l'événement keyup
     * @private
     */
    private handleKeyUp = (event: KeyboardEvent): void => {
        if (this.isDestroyed) return

        const action = this.events.get(event.code)
        if (action) {
            this.callback(action, 'stop')
        }
    }

    /**
     * Nettoie les ressources et supprime les écouteurs d'événements
     */
    public destroy(): void {
        if (this.isDestroyed) return

        window.removeEventListener('keydown', this.handleKeyDown)
        window.removeEventListener('keyup', this.handleKeyUp)
        this.events.clear()
        this.isDestroyed = true
    }

    /**
     * Vérifie si une touche est enregistrée
     * @param key - Code de la touche à vérifier
     */
    public hasEvent(key: KeyCode): boolean {
        return this.events.has(key)
    }

    /**
     * Récupère l'action associée à une touche
     * @param key - Code de la touche
     */
    public getAction(key: KeyCode): CharacterAction | undefined {
        return this.events.get(key)
    }
}
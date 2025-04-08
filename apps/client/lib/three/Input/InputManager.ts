import type { CharacterAction } from "../types/CharacterActions"
import { KeyboardManager, type EventType, type KeyCode } from "./KeyboardManager"
import { MouseManager, type MouseButton } from "./MouseManager"

/**
 * Type d'action possible pour une entrée
 * - 'once' : l'action est déclenchée une seule fois à l'appui
 * - 'continuous' : l'action est maintenue tant que l'entrée est active
 */
type ActionType = 'once' | 'continuous'

/**
 * Callback appelé lors d'une action
 * @param state - État de l'entrée (true = active, false = inactive)
 */
type Callback = (state?: boolean) => void

/**
 * Configuration d'une action
 */
type Action = {
    callback: Callback
    type: ActionType
    isActive?: boolean
}

/**
 * Gestionnaire principal des entrées
 * Singleton pour gérer toutes les actions du clavier et de la souris
 */
export class InputManager {
    private static instance: InputManager
    private keyboardManager: KeyboardManager
    private mouseManager: MouseManager
    private actions = new Map<CharacterAction, Action>()
    private isMapping = false
    private mappingCallback: ((key: KeyCode) => void) | null = null
    private actionKeys = new Map<CharacterAction, Set<KeyCode>>()

    private constructor() {
        this.keyboardManager = new KeyboardManager(this.handleInput.bind(this))
        this.mouseManager = new MouseManager(this.handleInput.bind(this))
        this.syncDefaultKeys()
    }

    private syncDefaultKeys(): void {
        // On récupère les touches par défaut du KeyboardManager
        const defaultEvents = (this.keyboardManager as any).events as Map<KeyCode, CharacterAction>

        // On nettoie d'abord notre Map
        this.actionKeys.clear()

        // On ajoute les touches par défaut
        defaultEvents.forEach((action, key) => {
            if (!this.actionKeys.has(action)) {
                this.actionKeys.set(action, new Set())
            }
            this.actionKeys.get(action)?.add(key)
        })
    }

    private addKey(key: KeyCode, action: CharacterAction): void {
        if (!this.actionKeys.has(action)) {
            this.actionKeys.set(action, new Set())
        }
        this.actionKeys.get(action)?.add(key)
        this.keyboardManager.addEvent(key, action)
    }

    private removeKey(key: KeyCode, action: CharacterAction): void {
        this.actionKeys.get(action)?.delete(key)
        this.keyboardManager.removeEvent(key)
    }

    /**
     * Récupère l'instance unique de l'InputManager
     */
    public static getInstance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager()
        }
        return InputManager.instance
    }

    /**
     * Enregistre une nouvelle action clavier
     * @param characterAction - L'action à enregistrer
     * @param actionType - Le type d'action ('once' ou 'continuous')
     * @param callback - La fonction à appeler lors de l'action
     * @throws Error si l'action existe déjà
     */
    public registerKeyboardEvent(characterAction: CharacterAction, actionType: ActionType, callback: Callback): void {
        if (this.actions.has(characterAction)) {
            throw new Error(`L'action "${characterAction}" est déjà enregistrée`)
        }
        this.actions.set(characterAction, { callback, type: actionType, isActive: false })
    }

    /**
     * Enregistre une nouvelle action souris
     * @param characterAction - L'action à enregistrer
     * @param actionType - Le type d'action ('once' ou 'continuous')
     * @param callback - La fonction à appeler lors de l'action
     * @throws Error si l'action existe déjà
     */
    public registerMouseEvent(characterAction: CharacterAction, actionType: ActionType, callback: Callback): void {
        if (this.actions.has(characterAction)) {
            throw new Error(`L'action "${characterAction}" est déjà enregistrée`)
        }
        this.actions.set(characterAction, { callback, type: actionType, isActive: false })
    }

    /**
     * Désenregistre une action
     * @param characterAction - L'action à désenregistrer
     */
    public unregisterEvent(characterAction: CharacterAction): void {
        this.actions.delete(characterAction)
    }

    /**
     * Vérifie si une action est actuellement active
     * @param characterAction - L'action à vérifier
     */
    public isActionActive(characterAction: CharacterAction): boolean {
        return this.actions.get(characterAction)?.isActive ?? false
    }

    /**
     * Gère les événements d'entrée
     * @private
     */
    private handleInput(characterAction: CharacterAction, eventType: EventType): void {
        const action = this.actions.get(characterAction)
        if (!action) {
            console.warn(`Action "${characterAction}" non trouvée`)
            return
        }

        action.isActive = eventType === 'start'

        if (action.type === 'once') {
            if (eventType === 'start') {
                action.callback()
            }
        } else {
            action.callback(eventType === 'start')
        }
    }

    /**
     * Nettoie les ressources
     */
    public destroy(): void {
        this.keyboardManager.destroy()
        this.mouseManager.destroy()
        this.actions.clear()
    }

    /**
     * Récupère tous les raccourcis clavier
     */
    public getKeyboardShortcuts(): Map<CharacterAction, string[]> {
        const shortcuts = new Map<CharacterAction, string[]>()

        this.actionKeys.forEach((keys, action) => {
            const displayKeys = Array.from(keys).map(key => this.formatKeyCode(key))
            shortcuts.set(action, displayKeys)
        })

        return shortcuts
    }

    /**
     * Récupère le libellé d'une action
     */
    public getActionLabel(action: CharacterAction): string {
        const labels: Record<CharacterAction, string> = {
            forward: 'Avancer',
            backward: 'Reculer',
            left: 'Gauche',
            right: 'Droite',
            jump: 'Sauter'
        }
        return labels[action] || action
    }

    /**
     * Formate un code de touche pour l'affichage
     * @private
     */
    private formatKeyCode(key: KeyCode): string {
        // Supprime le préfixe "Key" et "Space"
        return key.replace(/^Key/, '').replace(/^Space$/, 'Espace')
    }

    /**
     * Démarre le processus de mapping d'une touche
     * @param callback - Fonction appelée lorsqu'une touche est pressée
     */
    public startKeyMapping(callback: (key: KeyCode) => void): void {
        if (this.isMapping) return

        this.isMapping = true
        this.mappingCallback = callback

        const handleKeyDown = (event: KeyboardEvent) => {
            event.preventDefault()
            if (this.mappingCallback) {
                this.mappingCallback(event.code)
            }
            this.stopKeyMapping()
        }

        window.addEventListener('keydown', handleKeyDown, { once: true })
    }

    /**
     * Arrête le processus de mapping d'une touche
     */
    public stopKeyMapping(): void {
        this.isMapping = false
        this.mappingCallback = null
    }

    /**
     * Vérifie si un mapping est en cours
     */
    public isKeyMapping(): boolean {
        return this.isMapping
    }

    /**
     * Mappe une touche à une action
     * @param key - Code de la touche
     * @param action - Action à mapper
     */
    public mapKey(key: KeyCode, action: CharacterAction): void {
        this.addKey(key, action)
    }

    /**
     * Démappe une touche d'une action
     * @param key - Code de la touche à démapper
     * @param action - Action concernée
     */
    public unmapKey(key: KeyCode, action: CharacterAction): void {
        this.removeKey(key, action)
    }

    /**
     * Récupère toutes les touches associées à une action
     * @param action - Action concernée
     */
    public getActionKeys(action: CharacterAction): KeyCode[] {
        return Array.from(this.actionKeys.get(action) || [])
    }
}

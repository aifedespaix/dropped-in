// core/InputManager.ts

import type { InputAction } from '../types/InputActions';
import type { InputKey } from '../types/InputKeys';

export class InputManager {
    private static _instance: InputManager;

    // État brut des touches clavier
    private keyStates: Map<InputKey, boolean> = new Map();
    private previousKeyStates: Map<InputKey, boolean> = new Map();

    // Mapping entre action abstraite et touche physique
    private bindings: Map<InputAction, InputKey> = new Map();

    private constructor() { }

    static getInstance(): InputManager {
        if (!this._instance) {
            this._instance = new InputManager();
        }
        return this._instance;
    }

    init(): void {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        // Bindings par défaut
        this.bind("moveForward", "KeyW");
        this.bind("moveBackward", "KeyS");
        this.bind("moveLeft", "KeyA");
        this.bind("moveRight", "KeyD");
        this.bind("jump", "Space");
        this.bind("attack", "Mouse0"); // si tu veux utiliser la souris
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        const key = event.code as InputKey;
        this.keyStates.set(key, true);
    };

    private onKeyUp = (event: KeyboardEvent): void => {
        const key = event.code as InputKey;
        this.keyStates.set(key, false);
    };

    /**
     * Appelé à chaque frame pour capturer l'état précédent des touches
     */
    update(dt: number): void {
        this.previousKeyStates = new Map(this.keyStates); // snapshot
    }

    /**
     * L'action est-elle enfoncée actuellement ?
     */
    isPressed(action: InputAction): boolean {
        const key = this.bindings.get(action);
        return key ? this.keyStates.get(key) === true : false;
    }

    /**
     * fonctionne pas
     */
    wasJustPressed(action: InputAction): boolean {
        const key = this.bindings.get(action);
        if (!key) return false;

        const current = this.keyStates.get(key);
        const prev = this.previousKeyStates.get(key);

        return current === true && prev !== true;
    }

    /**
     * Permet de lier une touche physique à une action abstraite
     */
    bind(action: InputAction, key: InputKey): void {
        this.bindings.set(action, key);
    }

    /**
     * Retire une action du mapping
     */
    unbind(action: InputAction): void {
        this.bindings.delete(action);
    }

    /**
     * Accès direct à l'état d'une touche clavier
     */
    getRawKeyState(key: InputKey): boolean {
        return this.keyStates.get(key) || false;
    }

    /**
     * Pour libérer les listeners au besoin
     */
    destroy(): void {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }
}

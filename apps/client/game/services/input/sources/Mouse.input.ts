import type { _Input } from "./_Input";
import type { InputAction } from "../InputBindings";

export enum MouseButton {
    Left = 0,
    Right = 1,
    Middle = 2,
}

const MOUSE_MAPPING: Partial<Record<InputAction, number[]>> = {
    jump: [MouseButton.Left],
    toggleTorch: [MouseButton.Middle],
};

export class MouseInput implements _Input {
    #pressed = new Set<number>();
    #justPressed = new Set<number>();
    #movementX = 0;
    #movementY = 0;

    constructor() {
        window.addEventListener("mousedown", this.#onMouseDown);
        window.addEventListener("mouseup", this.#onMouseUp);
        window.addEventListener("mousemove", this.#onMouseMove);
    }

    #onMouseDown = (e: MouseEvent) => {
        if (!this.#pressed.has(e.button)) {
            this.#justPressed.add(e.button);
        }
        this.#pressed.add(e.button);
    };

    #onMouseUp = (e: MouseEvent) => {
        this.#pressed.delete(e.button);
        this.#justPressed.delete(e.button);
    };

    #onMouseMove = (e: MouseEvent) => {
        if (document.pointerLockElement) { // on est sûr d'être en mode "capture souris"
            this.#movementX += e.movementX;
            this.#movementY += e.movementY;
        }
    };

    getMovement(): { x: number, y: number } {
        const movement = { x: this.#movementX, y: this.#movementY };
        this.#movementX = 0;
        this.#movementY = 0;
        return movement;
    }

    getLookInput(): { x: number, y: number } {
        return this.getMovement();
    }

    update(): void {
        this.#justPressed.clear();
    }

    isActionActive(action: InputAction): boolean {
        const buttons = MOUSE_MAPPING[action] ?? [];
        return buttons.some(button => this.#pressed.has(button));
    }

    dispose(): void {
        window.removeEventListener("mousedown", this.#onMouseDown);
        window.removeEventListener("mouseup", this.#onMouseUp);
        window.removeEventListener("mousemove", this.#onMouseMove);
    }
}

import type { _Input } from "./_Input";
import type { InputAction } from "~/game/types/InputBinding";

export enum MouseButton {
    Left = 0,
    Right = 1,
    Middle = 2,
}

const MOUSE_MAPPING: Partial<Record<InputAction, number[]>> = {
    jump: [MouseButton.Left],         // clic gauche pour sauter par exemple
    toggleTorch: [MouseButton.Middle],  // clic molette pour allumer la torche
    // tu peux ajouter d'autres actions
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
        this.#movementX += e.movementX;
        this.#movementY += e.movementY;
    };

    getMovement(): { x: number, y: number } {
        const movement = { x: this.#movementX, y: this.#movementY };
        // Reset après lecture
        this.#movementX = 0;
        this.#movementY = 0;
        return movement;
    }

    update(): void {
        this.#justPressed.clear();
    }

    isActionActive(action: InputAction): boolean {
        const buttons = MOUSE_MAPPING[action] ?? [];
        // Adapte ici selon ton InputBinding si certaines actions souris doivent être continues ou ponctuelles
        return buttons.some(button => this.#pressed.has(button));
    }

    dispose(): void {
        window.removeEventListener("mousedown", this.#onMouseDown);
        window.removeEventListener("mouseup", this.#onMouseUp);
        window.removeEventListener("mousemove", this.#onMouseMove);
    }
}

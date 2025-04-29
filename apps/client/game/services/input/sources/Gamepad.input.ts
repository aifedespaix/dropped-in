import type { _Input } from "./_Input";
import type { InputAction } from "../InputBindings";
import { DEFAULT_INPUT_BINDINGS } from "../InputBindings";

export enum GamepadButton {
    DPadUp = 12,
    DPadDown = 13,
    DPadLeft = 14,
    DPadRight = 15,
    A = 0,
    Y = 3,
}

const GAMEPAD_MAPPING: Record<InputAction, number[]> = {
    moveForward: [GamepadButton.DPadUp],
    moveBackward: [GamepadButton.DPadDown],
    moveLeft: [GamepadButton.DPadLeft],
    moveRight: [GamepadButton.DPadRight],
    jump: [GamepadButton.A],
    toggleTorch: [GamepadButton.Y],
};

export class GamepadInput implements _Input {
    #justPressed = new Set<number>();
    #pressed = new Set<number>();

    update(): void {
        const gamepads = navigator.getGamepads?.();
        const pad = gamepads?.[0];
        if (!pad) return;

        this.#justPressed.clear();
        for (let i = 0; i < pad.buttons.length; i++) {
            const btn = pad.buttons[i];
            if (btn.pressed && !this.#pressed.has(i)) this.#justPressed.add(i);
            if (btn.pressed) this.#pressed.add(i);
            else this.#pressed.delete(i);
        }
    }

    isActionActive(action: InputAction): boolean {
        const buttonIndices = GAMEPAD_MAPPING[action] ?? [];
        const continuous = DEFAULT_INPUT_BINDINGS[action]?.continuous;

        return continuous
            ? buttonIndices.some(index => this.#pressed.has(index))
            : buttonIndices.some(index => this.#justPressed.has(index));
    }

    /** récupère l'input de visée depuis le stick droit */
    getLookInput(): { x: number; y: number } {
        const gamepads = navigator.getGamepads?.();
        const pad = gamepads?.[0];
        if (!pad) return { x: 0, y: 0 };

        const x = pad.axes[2] ?? 0; // Stick droit horizontal
        const y = pad.axes[3] ?? 0; // Stick droit vertical

        // Attention : parfois selon les manettes, y est inversé (on pourra inverser si besoin)

        return { x, y };
    }
}

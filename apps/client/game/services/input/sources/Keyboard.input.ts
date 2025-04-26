import { DEFAULT_INPUT_BINDINGS, type InputAction, type InputBinding } from "~/game/types/InputBinding";
import type { _Input } from "./_Input";

export class KeyboardInput implements _Input {
    readonly #pressed = new Set<string>();
    readonly #justPressed = new Set<string>();
    readonly #bindings: Record<InputAction, InputBinding>;

    constructor(bindings = DEFAULT_INPUT_BINDINGS) {
        this.#bindings = bindings;

        window.addEventListener("keydown", this.#onKeyDown);
        window.addEventListener("keyup", this.#onKeyUp);
    }

    #onKeyDown = (e: KeyboardEvent) => {
        const code = e.code;
        if (!this.#pressed.has(code)) {
            this.#justPressed.add(code);
        }
        this.#pressed.add(code);
    };

    #onKeyUp = (e: KeyboardEvent) => {
        const code = e.code;
        this.#pressed.delete(code);
        this.#justPressed.delete(code);
    };

    // À appeler en début de frame
    update(): void {
        this.#justPressed.clear();
    }

    isActionActive(action: InputAction): boolean {
        const binding = this.#bindings[action];
        if (!binding) return false;

        return binding.continuous
            ? binding.keys.some(key => this.#pressed.has(key))
            : binding.keys.some(key => this.#justPressed.has(key));
    }

    dispose(): void {
        window.removeEventListener("keydown", this.#onKeyDown);
        window.removeEventListener("keyup", this.#onKeyUp);
    }
}

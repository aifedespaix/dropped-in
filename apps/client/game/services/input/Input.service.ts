import { _Service } from "../_Service";
import type { InputAction } from "./InputBindings";
import type { _Input } from "./sources/_Input";
import { KeyboardInput } from "./sources/Keyboard.input";
import { GamepadInput } from "./sources/Gamepad.input";
import { MouseInput } from "./sources/Mouse.input";

export class InputService extends _Service {
    readonly #sources: _Input[];

    constructor() {
        super();
        this.#sources = [
            new KeyboardInput(),
            new GamepadInput(),
            new MouseInput(),
        ];

    }

    update(): void {
        for (const source of this.#sources) source.update?.();
    }

    getMouseMovement(): { x: number; y: number } {
        const mouseSource = this.#sources.find(source => source instanceof MouseInput) as MouseInput | undefined;

        if (!mouseSource) {
            return { x: 0, y: 0 };
        }

        return mouseSource.getMovement();
    }

    getLookInput(): { x: number; y: number } {
        let x = 0;
        let y = 0;

        for (const source of this.#sources) {
            if (source.getLookInput) {
                const move = source.getLookInput();
                x += move.x;
                y += move.y;
            }
        }

        return { x, y };
    }



    isActionActive(action: InputAction): boolean {
        const isActive = this.#sources.some(source => source.isActionActive(action));
        return isActive;
    }

    dispose(): void {
        for (const source of this.#sources) source.dispose?.();
    }
}

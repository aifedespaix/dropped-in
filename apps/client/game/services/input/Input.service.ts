import { _Service } from "../_Service";
import type { InputAction } from "../../types/InputBinding";
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
            // tu peux ajouter MouseInputSource ici aussi
        ];
    }

    update(): void {
        for (const source of this.#sources) source.update?.();
    }

    isActionActive(action: InputAction): boolean {
        return this.#sources.some(source => source.isActionActive(action));
    }

    dispose(): void {
        for (const source of this.#sources) source.dispose?.();
    }
}

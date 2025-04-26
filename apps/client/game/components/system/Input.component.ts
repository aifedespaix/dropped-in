import { _Component, ComponentType } from "../_Component";
import type { InputService } from "~/game/services/input/Input.service";
import { Vector3 } from "three";

export class InputComponent extends _Component {
    readonly #inputService: InputService;

    constructor(inputService: InputService) {
        super(ComponentType.Runtime);
        this.#inputService = inputService;
    }

    getDirection(): Vector3 {
        const x = (this.#inputService.isActionActive("moveRight") ? -1 : 0) + (this.#inputService.isActionActive("moveLeft") ? 1 : 0);
        const z = (this.#inputService.isActionActive("moveBackward") ? -1 : 0) + (this.#inputService.isActionActive("moveForward") ? 1 : 0);
        return new Vector3(x, 0, z).normalize();
    }

    isJumping(): boolean {
        return this.#inputService.isActionActive("jump");
    }

    toggleTorch(): boolean {
        return this.#inputService.isActionActive("toggleTorch");
    }
}

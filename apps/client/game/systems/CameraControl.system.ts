import { _System } from "~/game/systems/_System";
import type { ServiceLocator } from "~/game/core/ServiceLocator";
import type { GameCamera } from "~/game/cameras/Game.camera";
import type { Entity } from "~/game/entities/Entity";
import type { _CameraMode } from "~/game/cameras/modes/_CameraMode";
import { InputService } from "~/game/services/input/Input.service";
import { PlayerFlagComponent } from "../components/declarative/PlayerFlag.component";
import { ThirdPersonCameraMode } from "../cameras/modes/ThirdPerson.mode";

export class CameraControlSystem extends _System {
    readonly #sensitivity: number = 0.0015;

    readonly #input: InputService;
    readonly #camera: GameCamera;

    #player!: Entity;
    #currentMode!: _CameraMode;

    constructor(serviceLocator: ServiceLocator, camera: GameCamera) {
        super(serviceLocator);
        this.#input = serviceLocator.get("input");
        this.#camera = camera;
    }

    switchMode(mode: _CameraMode): void {
        this.#currentMode = mode;
    }

    override loadEntities(allEntities: Iterable<Entity>): void {
        for (const entity of allEntities) {
            if (entity.hasComponent(PlayerFlagComponent)) {
                this.#player = entity;
                break;
            }
        }
        // this.switchMode(new FirstPersonCameraMode(this.#camera, this.#player));
        this.switchMode(new ThirdPersonCameraMode(this.#camera, this.#player));
    }

    override update(delta: number): void {
        super.update(delta);
        if (!this.#camera) throw new Error("Camera not set");
        if (!this.#player) throw new Error("Player not set");
        if (!this.#currentMode) throw new Error("Current mode not set");

        const { x, y } = this.#input.getMouseMovement();

        if (x !== 0 || y !== 0) {
            this.#currentMode.onLookInput(x * this.#sensitivity, y * this.#sensitivity);
        }

        this.#currentMode.update();
    }

}

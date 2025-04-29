import type { GameCamera } from "../Game.camera";
import type { Entity } from "~/game/entities/Entity";

export abstract class _CameraMode {
    protected readonly camera: GameCamera;
    protected readonly player: Entity;

    constructor(camera: GameCamera, player: Entity) {
        this.camera = camera;
        this.player = player;
    }

    abstract onLookInput(x: number, y: number): void;
    update(): void { }
}

import type { Entity } from "~/game/entities/Entity";
import type { GameCamera } from "../Game.camera";
import { _CameraMode } from "./_CameraMode";
import { MathUtils } from "three";
import { RotationRequestComponent } from "~/game/components/declarative/RotationRequest.component";
import { MeshComponent } from "~/game/components/graphic/Mesh.component";

export class FirstPersonCameraMode extends _CameraMode {
    readonly verticalMultiplier = 1.0;
    #yawSpeed = 2.5;
    #pitchSpeed = 2.5;
    #pitch = 0;

    constructor(camera: GameCamera, player: Entity) {
        super(camera, player);
        this.attachCameraToPlayer();
    }

    attachCameraToPlayer(): void {
        this.camera.parent?.remove(this.camera);
        this.player.getComponent(MeshComponent).mesh.add(this.camera);
        this.camera.position.set(0, 1.8, 0);
    }

    onLookInput(x: number, y: number): void {
        // Rotation horizontale → joueur tourne sur Y
        const rotationRequest = this.player.getComponent(RotationRequestComponent);
        rotationRequest.yawDelta -= x * this.#yawSpeed;

        // Rotation verticale → pitch de la caméra
        this.#pitch -= y * this.#pitchSpeed * this.verticalMultiplier;

        // Clamp vertical pour éviter de tourner complètement
        const PI_2 = Math.PI / 2;
        this.#pitch = MathUtils.clamp(this.#pitch, -PI_2, PI_2);
    }
}

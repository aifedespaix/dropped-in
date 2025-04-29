import type { Entity } from "~/game/entities/Entity";
import type { GameCamera } from "../Game.camera";
import { _CameraMode } from "./_CameraMode";
import { MeshComponent } from "~/game/components/graphic/Mesh.component";
import { RotationRequestComponent } from "~/game/components/declarative/RotationRequest.component";
import { Vector3 } from "three";

export class ThirdPersonCameraMode extends _CameraMode {
    readonly verticalMultiplier = 1.0;
    readonly distance: number;
    readonly height: number;
    readonly rotationSpeed = 2.5;
    readonly pitchSpeed = 2.5;
    private currentPitch: number = 0;
    private readonly minPitch: number = -Math.PI / 3; // -60 degrés
    private readonly maxPitch: number = Math.PI / 3;  // 60 degrés

    constructor(camera: GameCamera, player: Entity, distance = 4, height = 2) {
        super(camera, player);
        this.distance = distance;
        this.height = height;
        this.attachCameraToPlayer();
    }

    attachCameraToPlayer(): void {
        this.camera.parent?.remove(this.camera);
        this.player.getComponent(MeshComponent).mesh.add(this.camera);
        this.camera.position.set(0, this.height, -this.distance); // Position initiale derrière le joueur
        this.updateLookAt();
    }

    updateLookAt(): void {
        const targetPosition = new Vector3(0, this.height, 0);

        this.player.getComponent(MeshComponent).mesh.localToWorld(targetPosition);

        this.camera.lookAt(targetPosition);
    }

    onLookInput(x: number, y: number): void {
        // Rotation horizontale (yaw) - fait tourner le joueur
        const rotationRequest = this.player.getComponent(RotationRequestComponent);
        rotationRequest.yawDelta -= x * this.rotationSpeed;

        // Rotation verticale (pitch) - déplace la caméra de haut en bas
        this.currentPitch = Math.max(
            this.minPitch,
            Math.min(this.maxPitch, this.currentPitch + y * this.pitchSpeed)
        );

        // Calculer la nouvelle position de la caméra sur l'arc de cercle
        const horizontalDistance = this.distance * Math.cos(this.currentPitch);
        const verticalDistance = this.distance * Math.sin(this.currentPitch);

        this.camera.position.set(
            0,
            this.height + verticalDistance,
            -horizontalDistance
        );

        // Mettre à jour le point de vue après chaque mouvement
        this.updateLookAt();
    }
}

import { RapierPhysicsComponent } from "../components/physics/RapierPhysicsComponent";
import { _Entity } from "../entities/_Entity";
import { _System } from "./_System";
import * as THREE from 'three';
import { CollisionStateComponent } from "../components/CollisionStateComponent";
export class PlatformFollowerSystem extends _System {
    private sourceEntity: _Entity;

    constructor(sourceEntity: _Entity) {
        super();
        this.sourceEntity = sourceEntity;
    }

    update(dt: number, entities: _Entity[]): void {
        const playerPhysics = this.sourceEntity.tryGetComponent(RapierPhysicsComponent);
        if (!playerPhysics) return;

        console.log("PlatformFollowerSystem");
        // On ne suit qu'une seule plateforme : la première en contact avec un tag ou condition
        for (const entity of entities) {
            const collisionStateComponent = entity.tryGetComponent(CollisionStateComponent);
            if (!collisionStateComponent) continue;

            const platformPhysics = entity.tryGetComponent(RapierPhysicsComponent);
            if (!platformPhysics) continue;

            const playerPos = playerPhysics.body.translation();
            const platformPos = platformPhysics.body.translation();
            const relativePos = new THREE.Vector3(
                playerPos.x - platformPos.x,
                playerPos.y - platformPos.y,
                playerPos.z - platformPos.z
            );

            const platformVel = platformPhysics.body.linvel();
            const platformAngVel = platformPhysics.body.angvel();

            const r = new THREE.Vector3(relativePos.x, relativePos.y, relativePos.z);
            const omega = new THREE.Vector3(platformAngVel.x, platformAngVel.y, platformAngVel.z);
            const rotationVel = new THREE.Vector3().crossVectors(omega, r);

            const finalVelocity = new THREE.Vector3(
                platformVel.x + rotationVel.x,
                platformVel.y + rotationVel.y,
                platformVel.z + rotationVel.z
            );

            playerPhysics.body.setLinvel({ x: finalVelocity.x, y: playerPhysics.body.linvel().y, z: finalVelocity.z }, true);
            break; // on ne suit qu'une seule plateforme à la fois

        }
    }
}

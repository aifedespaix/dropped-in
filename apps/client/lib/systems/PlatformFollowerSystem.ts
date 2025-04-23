import { RapierPhysicsComponent } from "../components/physics/RapierPhysicsComponent";
import { _Entity } from "../entities/_Entity";
import { _System } from "./_System";
import * as THREE from 'three';
import { CollisionStateComponent } from "../components/CollisionStateComponent";

/**
 * Suit une entité en contact avec une autre entité.
 * Ne suit qu'une entité à la fois. Elle doit avoir un CollisionStateComponent.
 */
export class PlatformFollowerSystem extends _System {
    private _sourceEntity: _Entity;
    private _targetEntities: _Entity[];

    constructor(sourceEntity: _Entity, targetEntities: _Entity[]) {
        super();
        this._sourceEntity = sourceEntity;
        this._targetEntities = targetEntities.filter(entity => entity.hasComponent(CollisionStateComponent));
    }

    update(dt: number): void {
        const playerPhysics = this._sourceEntity.getComponent(RapierPhysicsComponent);
        const targetEntity = this._findTargetEntity()
        if (!targetEntity) return;

        const platformPhysics = targetEntity.getComponent(RapierPhysicsComponent);

        const playerPos = playerPhysics.body.translation();
        const platformPos = platformPhysics.body.translation();
        const relativePos = new THREE.Vector3().subVectors(
            new THREE.Vector3(playerPos.x, playerPos.y, playerPos.z),
            new THREE.Vector3(platformPos.x, platformPos.y, platformPos.z)
        );

        const platformVel = platformPhysics.body.linvel();
        const platformAngVel = platformPhysics.body.angvel();

        const r = new THREE.Vector3(relativePos.x, relativePos.y, relativePos.z);
        const omega = new THREE.Vector3(platformAngVel.x, platformAngVel.y, platformAngVel.z);
        const rotationVel = new THREE.Vector3().crossVectors(omega, r);

        const currentVel = playerPhysics.body.linvel();

        const usePlatformX = Math.abs(currentVel.x) < 0.01;
        const usePlatformZ = Math.abs(currentVel.z) < 0.01;

        const finalVelocity = new THREE.Vector3(
            usePlatformX ? platformVel.x + rotationVel.x : currentVel.x,
            currentVel.y,
            usePlatformZ ? platformVel.z + rotationVel.z : currentVel.z
        );

        playerPhysics.body.setLinvel({
            x: finalVelocity.x,
            y: finalVelocity.y,
            z: finalVelocity.z
        }, true);
    }

    private _findTargetEntity(): _Entity | undefined {
        return this._targetEntities.find(entity =>
            entity
                .getComponent(CollisionStateComponent)
                ?.isCollidingWith(this._sourceEntity.name)
        );
    }
}


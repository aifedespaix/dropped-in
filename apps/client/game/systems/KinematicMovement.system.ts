import { _Entity } from "~/game/entities/_Entity";
import { _System } from "./_System";
import { InputComponent } from "~/game/components/system/Input.component";
import { KinematicGravityComponent } from "~/game/components/declarative/KinematicGravity.component";
import { PhysicsInstanceComponent } from "~/game/components/physic/PhysicInstance.component";
import { KinematicControllerComponent } from "~/game/components/declarative/KinematicController.component";

import type { World, KinematicCharacterController } from "@dimforge/rapier3d-compat";
import { Vector3, Quaternion } from "three";
import { Vector3 as RapierVector3 } from "@dimforge/rapier3d-compat";
import type { ServiceLocator } from "~/game/core/ServiceLocator";

export class KinematicMovementSystem extends _System {

    readonly #world: World;
    readonly #controller: KinematicCharacterController;

    constructor(
        serviceLocator: ServiceLocator,
        world: World,
        controller: KinematicCharacterController
    ) {
        super(serviceLocator);
        this.#world = world;
        this.#controller = controller;
    }

    protected entityFilter(entity: _Entity): boolean {
        console.log("KinematicMovementSystem entityFilter", entity.id, entity.hasComponent(InputComponent), entity.hasComponent(KinematicGravityComponent), entity.hasComponent(KinematicControllerComponent), entity.hasComponent(PhysicsInstanceComponent));
        return (
            entity.hasComponent(InputComponent) &&
            entity.hasComponent(KinematicGravityComponent) &&
            entity.hasComponent(KinematicControllerComponent) &&
            entity.hasComponent(PhysicsInstanceComponent)
        );
    }

    protected updateEntity(entity: _Entity, delta: number): void {
        console.log("KinematicMovementSystem updateEntity", entity.id);
        const input = entity.getComponent(InputComponent);
        const gravity = entity.getComponent(KinematicGravityComponent);
        const controller = entity.getComponent(KinematicControllerComponent);
        const instance = entity.getComponent(PhysicsInstanceComponent);

        const body = this.#world.getRigidBody(instance.rigidBody);
        const collider = this.#world.getCollider(instance.collider);
        const rotation = body.rotation();

        // 🕹️ Direction d'input (locale)
        const inputDir = input.getDirection();
        const move = new Vector3(inputDir.x, 0, inputDir.z);

        // Appliquer la rotation du corps
        const quat = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
        move.applyQuaternion(quat).normalize().multiplyScalar(5); // vitesse arbitraire

        // Gravité
        gravity.velocityY += gravity.gravity * delta;
        move.y = gravity.velocityY;

        // Déplacement désiré
        const desired = move.multiplyScalar(delta);

        // Collision check via controller
        this.#controller.computeColliderMovement(collider, new RapierVector3(desired.x, desired.y, desired.z));

        const finalMove = this.#controller.computedMovement();
        const currentPos = body.translation();

        const newPos = {
            x: currentPos.x + finalMove.x,
            y: currentPos.y + finalMove.y,
            z: currentPos.z + finalMove.z,
        };

        body.setNextKinematicTranslation(newPos);

        // Reset de la vélocité verticale si on touche le sol
        if (this.#controller.computedGrounded()) {
            gravity.reset();
        }
    }
}

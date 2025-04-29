import { Entity } from "~/game/entities/Entity";
import { _System } from "../_System";
import { InputComponent } from "~/game/components/system/Input.component";
import { KinematicGravityComponent } from "~/game/components/declarative/KinematicGravity.component";
import { PhysicsInstanceComponent } from "~/game/components/physic/PhysicInstance.component";
import { KinematicControllerComponent } from "~/game/components/declarative/KinematicController.component";

import type { Collider, RigidBody, World } from "@dimforge/rapier3d-compat";
import { KinematicCharacterController } from "@dimforge/rapier3d-compat";
import { Vector3, Quaternion } from "three";
import { Vector3 as RapierVector3 } from "@dimforge/rapier3d-compat";
import type { ServiceLocator } from "~/game/core/ServiceLocator";

export class KinematicMovementSystem extends _System {
    readonly #world: World;
    readonly #controller: KinematicCharacterController;

    constructor(
        serviceLocator: ServiceLocator,
        world: World,
    ) {
        super(serviceLocator);
        this.#world = world;
        this.#controller = world.createCharacterController(0.01);
    }

    protected override entityFilter(entity: Entity): boolean {
        return (
            entity.hasComponent(InputComponent) &&
            entity.hasComponent(KinematicGravityComponent) &&
            entity.hasComponent(KinematicControllerComponent) &&
            entity.hasComponent(PhysicsInstanceComponent)
        );
    }

    protected override updateEntity(entity: Entity, delta: number): void {
        const input = entity.getComponent(InputComponent);
        const gravity = entity.getComponent(KinematicGravityComponent);
        const instance = entity.getComponent(PhysicsInstanceComponent);

        const body = this.#world.getRigidBody(instance.rigidBody);
        const collider = this.#world.getCollider(instance.collider);

        const move = this.#computeInputMove(body, input);
        this.#applyGravity(gravity, delta);

        const isGrounded = this.#controller.computedGrounded();
        this.#handleJump(input, gravity, isGrounded);

        this.#moveCharacter(body, collider, move, gravity, delta);
    }

    #computeInputMove(body: RigidBody, input: InputComponent): Vector3 {
        const inputDir = input.getDirection();
        const move = new Vector3(inputDir.x, 0, inputDir.z);

        const rotation = body.rotation();
        const quat = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);

        return move.applyQuaternion(quat).normalize().multiplyScalar(5); // vitesse arbitraire
    }

    #applyGravity(gravity: KinematicGravityComponent, delta: number): void {
        gravity.velocityY += gravity.gravity * delta;
    }

    #handleJump(input: InputComponent, gravity: KinematicGravityComponent, isGrounded: boolean): void {
        if (isGrounded) {
            if (gravity.velocityY < 0) gravity.velocityY = 0;

            if (input.isJumping()) {
                gravity.velocityY = gravity.jumpForce;
            }
        }
    }

    #moveCharacter(body: RigidBody, collider: Collider, move: Vector3, gravity: KinematicGravityComponent, delta: number): void {
        move.y = gravity.velocityY;

        const desired = move.multiplyScalar(delta);

        this.#controller.computeColliderMovement(collider, new RapierVector3(desired.x, desired.y, desired.z));

        const finalMove = this.#controller.computedMovement();
        const currentPos = body.translation();

        const newPos = {
            x: currentPos.x + finalMove.x,
            y: currentPos.y + finalMove.y,
            z: currentPos.z + finalMove.z,
        };

        body.setNextKinematicTranslation(newPos);
    }


}

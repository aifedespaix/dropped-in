import { _System } from "~/game/systems/_System";
import { init as initRapier, World, Vector3, RigidBody } from "@dimforge/rapier3d-compat";
import { GRAVITY } from "~/game/constants";
import { PhysicsInstanceComponent } from "~/game/components/physic/PhysicInstance.component";
import { PhysicsBodyComponent } from "~/game/components/declarative/PhysicBody.component";
import { HitboxComponent } from "~/game/components/declarative/HitboxCube.component";
import type { Entity } from "~/game/entities/Entity";
import type { ServiceLocator } from "~/game/core/ServiceLocator";
import { KinematicMovementSystem } from "./physic/KinematicMovement.system";
import { RotationRequestComponent } from "../components/declarative/RotationRequest.component";
import { Euler, Quaternion } from "three";
import { PhysicBuilderRegistry } from "~/game/builders/PhysicBuilder.registry";
import { ComponentSource } from "../components/_Component";
import { MoveBetweenPointsSystem } from "./physic/MoveBetweenPoints.system";
import { RotateSystem } from "./physic/Rotate.system";
export class PhysicsSystem extends _System {
    #world!: World;

    readonly #builderRegistry = new PhysicBuilderRegistry();

    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    override async load(): Promise<void> {
        await initRapier();
        this.#world = new World(new Vector3(0, GRAVITY, 0));
        this.subSystems.add(new KinematicMovementSystem(this.serviceLocator, this.#world));
        this.subSystems.add(new MoveBetweenPointsSystem(this.serviceLocator, this.#world));
        this.subSystems.add(new RotateSystem(this.serviceLocator, this.#world));
    }

    protected override entityFilter(entity: Entity): boolean {
        return entity.hasComponent(PhysicsBodyComponent) && entity.hasComponent(HitboxComponent);
    }

    protected override onEntityAdded(entity: Entity): void {
        const bodyDesc = this.#builderRegistry.get("Body").build({
            entity,
        });
        const body = this.#world.createRigidBody(bodyDesc);

        const colliderDesc = this.#builderRegistry.get("Collider").build({
            entity,
        });
        const collider = this.#world.createCollider(colliderDesc, body);
        const physicsInstance = new PhysicsInstanceComponent(body.handle, collider.handle, colliderDesc);
        entity.addComponentSafe(physicsInstance, ComponentSource.System);

    }

    protected override updateEntity(entity: Entity, delta: number): void {
        const instance = entity.getComponent(PhysicsInstanceComponent);
        const body = this.#world.getRigidBody(instance.rigidBody);
        const pos = body.translation();
        entity.transform.setPosition([pos.x, pos.y, pos.z]);

        const rotationRequest = entity.tryGetComponent(RotationRequestComponent);
        if (rotationRequest && rotationRequest?.yawDelta !== 0) {
            const rot = this.applyRotation(body, rotationRequest);
            entity.transform.setRotation(rot);
        } else {
            const rot = body.rotation();
            entity.transform.setRotation(rot);
        }
    }

    applyRotation(body: RigidBody, rotationRequest: RotationRequestComponent): Quaternion {
        const currentRot = body.rotation();
        const quat = new Quaternion(currentRot.x, currentRot.y, currentRot.z, currentRot.w);
        const euler = new Euler().setFromQuaternion(quat, 'YXZ');

        euler.y += rotationRequest.yawDelta;

        const newQuat = new Quaternion().setFromEuler(euler);
        body.setRotation(newQuat, true);

        rotationRequest.reset();
        return newQuat;
    }

    override update(delta: number): void {
        super.update(delta);
        this.#world.step();
    }

}

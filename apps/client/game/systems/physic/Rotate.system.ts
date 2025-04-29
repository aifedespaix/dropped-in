import { _System } from "~/game/systems/_System";
import { RotateComponent } from "~/game/components/declarative/Rotate.component";
import { PhysicsInstanceComponent } from "~/game/components/physic/PhysicInstance.component";
import { Entity } from "~/game/entities/Entity";
import { World } from "@dimforge/rapier3d-compat";
import { ServiceLocator } from "~/game/core/ServiceLocator";
import { Vector3 } from "three";

export class RotateSystem extends _System {
    readonly #world: World;

    constructor(serviceLocator: ServiceLocator, world: World) {
        super(serviceLocator);
        this.#world = world;
    }

    protected override entityFilter(entity: Entity): boolean {
        return (
            entity.hasComponent(RotateComponent) &&
            entity.hasComponent(PhysicsInstanceComponent)
        );
    }

    protected override updateEntity(entity: Entity, delta: number): void {
        const rotateComponent = entity.getComponent(RotateComponent);
        const instance = entity.getComponent(PhysicsInstanceComponent);

        const body = this.#world.getRigidBody(instance.rigidBody);
        if (!body) return;


        // Appliquer un torque (couple) pour générer une rotation naturelle
        const axis = new Vector3(rotateComponent.axis[0], rotateComponent.axis[1], rotateComponent.axis[2]).normalize();
        const torqueStrength = rotateComponent.speed; // À ajuster selon le comportement voulu

        body.setEnabledRotations(axis.x !== 0, axis.y !== 0, axis.z !== 0, true);
        body.setEnabledTranslations(false, false, false, true);

        body.applyTorqueImpulse(
            {
                x: axis.x * torqueStrength * delta,
                y: axis.y * torqueStrength * delta,
                z: axis.z * torqueStrength * delta,
            },
            true, // wake_up the body
        );
    }
}

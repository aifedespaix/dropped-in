import { _System } from "~/game/systems/_System";
import { MoveBetweenPointsComponent, MoveMode } from "~/game/components/declarative/MoveBetweenPoints.component";
import { PhysicsInstanceComponent } from "~/game/components/physic/PhysicInstance.component";
import { Entity } from "~/game/entities/Entity";
import { World } from "@dimforge/rapier3d-compat";
import { Vector3 } from "three";
import { ServiceLocator } from "~/game/core/ServiceLocator";

export class MoveBetweenPointsSystem extends _System {
    readonly #world: World;

    constructor(serviceLocator: ServiceLocator, world: World) {
        super(serviceLocator);
        this.#world = world;
    }

    protected override entityFilter(entity: Entity): boolean {
        return (
            entity.hasComponent(MoveBetweenPointsComponent) &&
            entity.hasComponent(PhysicsInstanceComponent)
        );
    }

    protected override updateEntity(entity: Entity, delta: number): void {
        console.log("MoveBetweenPointsSystem updateEntity");
        const moveComponent = entity.getComponent(MoveBetweenPointsComponent);
        const instance = entity.getComponent(PhysicsInstanceComponent);

        const body = this.#world.getRigidBody(instance.rigidBody);
        if (!body) return;

        const currentPos = new Vector3().copy(body.translation());

        const target = moveComponent.currentDirection === 1 ? moveComponent.pointB : moveComponent.pointA;
        const targetPos = new Vector3(target[0], target[1], target[2]);
        const direction = new Vector3().subVectors(targetPos, currentPos);
        const distance = direction.length();

        if (distance < 0.05) { // Seuil pour considérer "atteint"
            this.#handleArrival(moveComponent);
            return;
        }

        direction.normalize();

        const moveStep = direction.multiplyScalar(moveComponent.speed * delta);

        const newPos = {
            x: currentPos.x + moveStep.x,
            y: currentPos.y + moveStep.y,
            z: currentPos.z + moveStep.z,
        };
        console.log("newPos", newPos, moveStep);
        body.setNextKinematicTranslation(newPos);
    }

    #handleArrival(component: MoveBetweenPointsComponent): void {
        switch (component.mode) {
            case MoveMode.OneWay:
                // Ne fait rien, reste au point B
                break;
            case MoveMode.PingPong:
                component.currentDirection *= -1;
                break;
            case MoveMode.Loop:
                component.currentDirection = 1;
                break;
        }
    }
}

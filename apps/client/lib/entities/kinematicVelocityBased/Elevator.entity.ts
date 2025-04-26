import { _RenderComponent } from "../../components/render/_RenderComponent";
import { _Entity } from "../_Entity";
import { PrimitiveRenderComponent, type PrimitiveRenderComponentOptions } from "../../components/render/PrimitiveRenderComponent";
import * as THREE from 'three';
import { RapierPhysicsComponent, type RapierPhysicsComponentOptions } from "../../components/physics/RapierPhysicsComponent";
import { HitboxSquareComponent } from "../../components/hitbox/HitBoxSquareComponent";
import { HitboxHelperComponent } from "../../components/helpers/HitboxHelperComponent";
import { CollisionStateComponent } from "../../components/CollisionStateComponent";
import { ElevatorComponent, type ElevatorComponentOptions } from "../../components/physics/Elevator.component";

export class ElevatorEntity extends _Entity {

    async init(): Promise<void> {
        const platformOptions: PrimitiveRenderComponentOptions = {
            type: 'box',
            width: 5,
            height: 0.1,
            depth: 5,
            color: new THREE.Color(0x334488)
        }

        const physicsOptions: Partial<RapierPhysicsComponentOptions> = {
            type: 'kinematicVelocity',
            isPlatform: true,
        }

        const elevatorOptions: ElevatorComponentOptions = {
            from: { x: 1, y: -2.5, z: 1 },
            to: { x: 0, y: 2, z: 0 },
            speed: 0.25,
        }
        this.addComponent(new PrimitiveRenderComponent(this.serviceLocator, platformOptions));
        this.addComponent(new RapierPhysicsComponent(this.serviceLocator, physicsOptions));
        this.addComponent(new ElevatorComponent(this.serviceLocator, elevatorOptions));

        this.addComponent(new HitboxSquareComponent(this.serviceLocator));
        this.addComponent(new HitboxHelperComponent(this.serviceLocator));

        this.addComponent(new CollisionStateComponent(this.serviceLocator));

        await this.initAllComponents();
        this.startAllComponents();
    }

    get name(): string {
        return "Pusher";
    }
}
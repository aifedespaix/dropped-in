import { _RenderComponent } from "../components/render/_RenderComponent";
import { _Entity } from "./_Entity";
import { TransformComponent } from "../components/transform/TransformComponent";
import { PrimitiveRenderComponent, type PrimitiveRenderComponentOptions } from "../components/render/PrimitiveRenderComponent";
import * as THREE from 'three';
import { RapierPhysicsComponent, type RapierPhysicsComponentOptions } from "../components/physics/RapierPhysicsComponent";
import { PhysicRotationComponent, type RotatorComponentOptions } from "../components/physics/PhysicRotationComponent";
import { HitboxSquareComponent } from "../components/hitbox/HitBoxSquareComponent";
import { HitboxHelperComponent } from "../components/helpers/HitboxHelperComponent";

export class PusherEntity extends _Entity {

    async init(): Promise<void> {
        const pusherOptions: PrimitiveRenderComponentOptions = {
            type: 'box',
            width: 50,
            height: 10,
            depth: 1,
            color: new THREE.Color(0x000000)
        }
        const physicsOptions: Partial<RapierPhysicsComponentOptions> = {
            position: { x: 0, y: 0, z: -30 },
            friction: 0,
            type: 'kinematic'
        }
        const rotationOptions: Partial<RotatorComponentOptions> = {
            speedY: 5,
        }
        this.addComponent(new PrimitiveRenderComponent(this.serviceLocator, pusherOptions));
        this.addComponent(new PhysicRotationComponent(this.serviceLocator, rotationOptions));
        this.addComponent(new RapierPhysicsComponent(this.serviceLocator, physicsOptions));
        this.addComponent(new HitboxSquareComponent(this.serviceLocator));
        this.addComponent(new HitboxHelperComponent(this.serviceLocator));

        await this.initAllComponents();
        this.startAllComponents();
    }

    get name(): string {
        return "Pusher";
    }
}
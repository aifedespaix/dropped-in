import { _RenderComponent } from "../components/render/_RenderComponent";
import { _Entity } from "./_Entity";
import { PrimitiveRenderComponent, type PrimitiveRenderComponentOptions } from "../components/render/PrimitiveRenderComponent";
import * as THREE from 'three';
import { RapierPhysicsComponent, type RapierPhysicsComponentOptions } from "../components/physics/RapierPhysicsComponent";
import { PhysicRotationComponent, type RotatorComponentOptions } from "../components/physics/PhysicRotationComponent";
import { HitboxSquareComponent } from "../components/hitbox/HitBoxSquareComponent";
import { HitboxHelperComponent } from "../components/helpers/HitboxHelperComponent";
import { CollisionStateComponent } from "../components/CollisionStateComponent";
export class PlatformEntity extends _Entity {

    async init(): Promise<void> {
        const platformOptions: PrimitiveRenderComponentOptions = {
            type: 'box',
            width: 50,
            height: 10,
            depth: 1,
            color: new THREE.Color(0x000000)
        }

        const euler = new THREE.Euler(THREE.MathUtils.degToRad(90), 0, 0, 'XYZ');
        const quaternion = new THREE.Quaternion().setFromEuler(euler);
        const physicsOptions: Partial<RapierPhysicsComponentOptions> = {
            position: { x: -30, y: 0, z: 0 },
            friction: 0,
            type: 'kinematic',
            rotation: quaternion
        }
        const rotationOptions: Partial<RotatorComponentOptions> = {
            speedY: 1,
        }
        this.addComponent(new PrimitiveRenderComponent(this.serviceLocator, platformOptions));
        this.addComponent(new PhysicRotationComponent(this.serviceLocator, rotationOptions));
        this.addComponent(new RapierPhysicsComponent(this.serviceLocator, physicsOptions));
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
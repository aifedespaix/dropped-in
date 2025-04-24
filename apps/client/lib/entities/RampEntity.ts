import { _RenderComponent } from "../components/render/_RenderComponent";
import { _Entity } from "./_Entity";
import { PrimitiveRenderComponent, type PrimitiveRenderComponentOptions } from "../components/render/PrimitiveRenderComponent";
import * as THREE from 'three';
import { RapierPhysicsComponent, type RapierPhysicsComponentOptions } from "../components/physics/RapierPhysicsComponent";
import type { ServiceLocator } from "../services/ServiceLocator";
import { HitboxSquareComponent } from "../components/hitbox/HitBoxSquareComponent";
import { HitboxHelperComponent } from "../components/helpers/HitboxHelperComponent";

export class RampEntity extends _Entity {

    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    async init(): Promise<void> {
        const primitiveRenderOptions: PrimitiveRenderComponentOptions = {
            type: 'box',
            width: 50,
            height: 20,
            depth: 0.1,
            color: new THREE.Color(0x883388)
        }

        const euler = new THREE.Euler(THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(65), 0, 'XYZ');
        const quaternion = new THREE.Quaternion().setFromEuler(euler);
        const physicsOptions: Partial<RapierPhysicsComponentOptions> = {
            position: { x: 10, y: -1.5, z: -10 },
            type: 'static',
            rotation: quaternion
        }

        this.addComponent(new HitboxSquareComponent(this.serviceLocator));
        this.addComponent(new PrimitiveRenderComponent(this.serviceLocator, primitiveRenderOptions));
        this.addComponent(new RapierPhysicsComponent(this.serviceLocator, physicsOptions));
        this.addComponent(new HitboxHelperComponent(this.serviceLocator));

        await this.initAllComponents();
        this.startAllComponents();
    }

    get name(): string {
        return "Ramp";
    }
}
import { _RenderComponent } from "../../components/render/_RenderComponent";
import { _Entity } from "../_Entity";
import { PrimitiveRenderComponent, type PrimitiveRenderComponentOptions } from "../../components/render/PrimitiveRenderComponent";
import { TransformComponent } from "../../components/transform/TransformComponent";
import * as THREE from 'three';
import { RapierPhysicsComponent, type RapierPhysicsComponentOptions } from "../../components/physics/RapierPhysicsComponent";
import type { ServiceLocator } from "../../services/ServiceLocator";
import { HitboxSquareComponent } from "../../components/hitbox/HitBoxSquareComponent";
import { HitboxHelperComponent } from "../../components/helpers/HitboxHelperComponent";

export class FloorEntity extends _Entity {

    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    async init(): Promise<void> {
        const primitiveRenderOptions: PrimitiveRenderComponentOptions = {
            type: 'box',
            width: 200,
            height: 0.1,
            depth: 200,
            color: new THREE.Color(0x223388)
        }
        const physicsOptions: Partial<RapierPhysicsComponentOptions> = {
            position: { x: 0, y: -2, z: 0 },
            type: 'static'
        }

        this.addComponent(new TransformComponent(this.serviceLocator));
        this.addComponent(new HitboxSquareComponent(this.serviceLocator));
        this.addComponent(new PrimitiveRenderComponent(this.serviceLocator, primitiveRenderOptions));
        this.addComponent(new RapierPhysicsComponent(this.serviceLocator, physicsOptions));
        this.addComponent(new HitboxHelperComponent(this.serviceLocator));

        await this.initAllComponents();
        this.startAllComponents();
    }

    get name(): string {
        return "Floor";
    }
}
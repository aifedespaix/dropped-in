import { _RenderComponent } from "../components/render/_RenderComponent";
import { _Entity } from "./_Entity";
import { ThreeRenderService } from "../services/ThreeRenderService";
import { PrimitiveRenderComponent, type PrimitiveRenderComponentOptions } from "../components/render/PrimitiveRenderComponent";
import { TransformComponent } from "../components/transform/TransformComponent";
import * as THREE from 'three';
import { RapierPhysicsComponent } from "../components/physics/RapierPhysicsComponent";
import { RapierPhysicsService } from "../services/RapierPhysicsService";
import { BoundingBoxComponent } from "../components/BoundingBoxComponent";

export class FloorEntity extends _Entity {
    private renderService: ThreeRenderService;
    private physicsService: RapierPhysicsService;

    constructor(renderService: ThreeRenderService, physicsService: RapierPhysicsService) {
        super();
        this.renderService = renderService;
        this.physicsService = physicsService;

    }

    async init(): Promise<void> {
        const options: PrimitiveRenderComponentOptions = {
            width: 100,
            height: 1,
            depth: 100,
            color: new THREE.Color(0x223388)
        }
        const promises: Promise<void>[] = [];
        promises.push(this.addComponent(new TransformComponent()));
        promises.push(this.addComponent(new BoundingBoxComponent()));
        promises.push(this.addComponent(new PrimitiveRenderComponent(this.renderService, 'box', options)));
        promises.push(this.addComponent(new RapierPhysicsComponent(this.physicsService, { x: 0, y: -2, z: 0 }, false)));

        await Promise.all(promises);
    }

    getName(): string {
        return "Floor";
    }
}
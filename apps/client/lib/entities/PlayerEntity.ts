// entities/PlayerEntity.ts

import { _Entity } from './_Entity';

import { TransformComponent } from '../components/transform/TransformComponent';
import { _RenderComponent } from '../components/render/_RenderComponent';
import { InputComponent } from '../components/InputComponent';
import { ActionComponent } from '../components/ActionComponent';
import { GlbRenderComponent } from '../components/render/GlbRenderComponent';
import { ThreeRenderService } from '../services/ThreeRenderService';
import { MovementControllerComponent } from '../components/logic/MovementControllerComponent';
import { RapierPhysicsComponent } from '../components/physics/RapierPhysicsComponent';
import { RapierPhysicsService } from '../services/RapierPhysicsService';
import { BoundingBoxComponent } from '../components/BoundingBoxComponent';
import { BoundingBoxHelperComponent } from '../components/BoundingBoxHelperComponent';

export class PlayerEntity extends _Entity {
    private renderService: ThreeRenderService;
    private physics: RapierPhysicsService;

    constructor(renderService: ThreeRenderService, physics: RapierPhysicsService) {
        super();
        this.renderService = renderService;
        this.physics = physics;
    }

    async init(): Promise<void> {
        const promises: Promise<void>[] = [];
        promises.push(this.addComponent(new GlbRenderComponent(this.renderService, "/models/player.glb")));

        const transform = new TransformComponent();
        promises.push(this.addComponent(transform));

        promises.push(this.addComponent(new BoundingBoxComponent()));
        promises.push(this.addComponent(new BoundingBoxHelperComponent(this.renderService)));
        promises.push(this.addComponent(new MovementControllerComponent()));
        promises.push(this.addComponent(new InputComponent()));
        promises.push(this.addComponent(new ActionComponent()));
        promises.push(this.addComponent(new RapierPhysicsComponent(this.physics, transform.position)));

        await Promise.all(promises);
    }

    getName(): string {
        return "Player";
    }
}

// entities/PlayerEntity.ts

import { _Entity } from './_Entity';

import { TransformComponent } from '../components/transform/TransformComponent';
import { _RenderComponent } from '../components/render/_RenderComponent';
import { InputComponent } from '../components/InputComponent';
import { ActionComponent } from '../components/ActionComponent';
import { GlbRenderComponent } from '../components/render/GlbRenderComponent';
import { MovementControllerComponent } from '../components/logic/MovementControllerComponent';
import { RapierPhysicsComponent, type RapierPhysicsComponentOptions } from '../components/physics/RapierPhysicsComponent';
import { HitboxHelperComponent } from '../components/helpers/HitboxHelperComponent';
import { HitboxCapsuleComponent } from '../components/hitbox/HitBoxCapsuleComponent';
import { CollisionStateComponent } from '../components/CollisionStateComponent';
export class PlayerEntity extends _Entity {

    async init(): Promise<void> {
        const physicsOptions: Partial<RapierPhysicsComponentOptions> = {
            isCcdEnabled: true,
        }
        this.addComponent(new GlbRenderComponent(this.serviceLocator, "/models/player.glb"));
        this.addComponent(new TransformComponent(this.serviceLocator));
        this.addComponent(new HitboxCapsuleComponent(this.serviceLocator));
        this.addComponent(new HitboxHelperComponent(this.serviceLocator));
        this.addComponent(new MovementControllerComponent(this.serviceLocator));
        this.addComponent(new InputComponent(this.serviceLocator));
        this.addComponent(new ActionComponent(this.serviceLocator));
        this.addComponent(new RapierPhysicsComponent(this.serviceLocator, physicsOptions));
        this.addComponent(new CollisionStateComponent(this.serviceLocator));

        await this.initAllComponents();
        this._lockPlayerRotation();
        this._fixCameraToPlayer();

        this.startAllComponents();

    }

    private _lockPlayerRotation() {
        const physics = this.getComponent(RapierPhysicsComponent);
        physics.body.lockRotations(true, true);
    }

    private _fixCameraToPlayer() {
        const camera = this.serviceLocator.get('render').camera;
        const renderComponent = this.getComponent(GlbRenderComponent);
        renderComponent.getObject3D().add(camera);
    }

    get name(): string {
        return "Player";
    }
}

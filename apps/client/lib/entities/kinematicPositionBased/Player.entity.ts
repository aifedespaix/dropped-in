import { _Entity } from '../_Entity';
import { _RenderComponent } from '../../components/render/_RenderComponent';
import { InputComponent } from '../../components/InputComponent';
import { ActionComponent } from '../../components/ActionComponent';
import { GlbRenderComponent } from '../../components/render/GlbRenderComponent';
import { MovementControllerComponent } from '../../components/physics/MovementController.component';
import { RapierPhysicsComponent, type RapierPhysicsComponentOptions } from '../../components/physics/RapierPhysicsComponent';
import { HitboxHelperComponent } from '../../components/helpers/HitboxHelperComponent';
import { HitboxCapsuleComponent } from '../../components/hitbox/HitBoxCapsuleComponent';
import { CollisionStateComponent } from '../../components/CollisionStateComponent';

export class PlayerEntity extends _Entity {
    async init(): Promise<void> {
        const physicsOptions: Partial<RapierPhysicsComponentOptions> = {
            isCcdEnabled: true,
            type: 'kinematicPosition',
        }
        this.addComponent(new GlbRenderComponent(this.serviceLocator, "/models/player.glb"));

        this.addComponent(new RapierPhysicsComponent(this.serviceLocator, physicsOptions));
        this.addComponent(new CollisionStateComponent(this.serviceLocator));

        this.addComponent(new MovementControllerComponent(this.serviceLocator));
        this.addComponent(new InputComponent(this.serviceLocator));
        this.addComponent(new ActionComponent(this.serviceLocator));

        this.addComponent(new HitboxCapsuleComponent(this.serviceLocator));
        this.addComponent(new HitboxHelperComponent(this.serviceLocator));

        await this.initAllComponents();
        this._lockPlayerRotation();

        this.startAllComponents();

    }

    private _lockPlayerRotation() {
        const physics = this.getComponent(RapierPhysicsComponent);
        physics.body.lockRotations(true, true);
    }

    get name(): string {
        return "Player";
    }
}

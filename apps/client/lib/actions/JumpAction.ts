import { _Action } from './_Action';
import { RapierPhysicsComponent } from '../components/physics/RapierPhysicsComponent';
import type { _Entity } from '../entities/_Entity';
import type { ActionChannel } from '../types/ActionChannel';
import { MovementControllerComponent } from '../components/physics/MovementController.component';

export class JumpAction extends _Action {

    override start(entity: _Entity): void {
        this.entity = entity;

        const physics = entity.getComponent(RapierPhysicsComponent);
        if (!physics.isGrounded()) return;

        const movement = entity.getComponent(MovementControllerComponent);
        movement.triggerJump();

        this.startedAt = performance.now();
        this.isStarted = true;
    }

    override getChannel(): ActionChannel {
        return "movement";
    }

    override isComplete(): boolean {
        return true;
    }

    override update(dt: number): void {

    }

    override end(): void {

    }
}

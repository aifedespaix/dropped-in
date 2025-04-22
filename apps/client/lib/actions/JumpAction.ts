import { _Action } from './_Action';
import { RapierPhysicsComponent } from '../components/physics/RapierPhysicsComponent';
import type { _Entity } from '../entities/_Entity';
import type { ActionChannel } from '../types/ActionChannel';

export class JumpAction extends _Action {
    private jumped = false;
    private force = 5;

    override start(entity: _Entity): void {
        this.entity = entity;
        const physics = entity.getComponent(RapierPhysicsComponent);

        if (!physics.isGrounded()) {
            return;
        }

        physics.applyImpulse({ y: this.force });

        this.jumped = true;
        this.startedAt = performance.now();
        this.isStarted = true;
    }

    override update(dt: number): void {
        const physics = this.entity?.tryGetComponent(RapierPhysicsComponent);
        if (!physics) return;

        if (physics.isGrounded()) {
            this.jumped = false;
        }
    }

    override end(): void {
        this.jumped = false;
    }

    override isComplete(): boolean {
        // Le saut est immédiat → considéré comme terminé dès qu'il a été lancé
        return this.jumped;
    }

    override isBlocking(): boolean {
        return false; // ne bloque pas d'autres actions (tu peux sauter en bougeant)
    }

    override getChannel(): ActionChannel {
        return "movement";
    }
}

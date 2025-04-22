import { _Action } from './_Action';
import { RapierPhysicsComponent } from '../components/physics/RapierPhysicsComponent';
import type { _Entity } from '../entities/_Entity';
import type { ActionChannel } from '../types/ActionChannel';

export class JumpAction extends _Action {
    private jumped = false;

    override start(entity: _Entity): void {
        this.entity = entity;
        const physics = entity.tryGetComponent(RapierPhysicsComponent);
        if (!physics) {
            console.warn("[JumpAction] No physics component found");
            return;
        }

        if (!physics.isGrounded()) {
            console.log("[JumpAction] Not grounded, cannot jump");
            return;
        }

        const beforeVel = physics.getVelocity();
        console.log("[JumpAction] Before jump - Velocity:", { x: beforeVel.x, y: beforeVel.y, z: beforeVel.z });

        // Augmenter la force de l'impulsion
        physics.applyImpulse({ y: 10 });

        const afterVel = physics.getVelocity();
        console.log("[JumpAction] After jump - Velocity:", { x: afterVel.x, y: afterVel.y, z: afterVel.z });

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

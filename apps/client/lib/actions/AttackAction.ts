import { _Action } from './_Action';
import { _Entity } from '../entities/_Entity';

export class AttackAction extends _Action {
    private duration: number = 0.6; // en secondes

    start(entity: _Entity): void {
        this.entity = entity;
        this.startedAt = performance.now();
        this.isStarted = true;

        // Tu peux déclencher ici une animation ou un son
        console.log(`[Attack] Entity ${entity.getId()} attaque`);
    }

    update(dt: number): void {
        // rien à faire si l'action est juste un timer
    }

    isComplete(): boolean {
        const elapsed = (performance.now() - this.startedAt) / 1000;
        return elapsed >= this.duration;
    }

    end(): void {
        // Animation de fin ou reset éventuel
        console.log(`[Attack] Entity ${this.entity.getId()} a fini`);
    }

    override isBlocking(): boolean {
        return true;
    }
}

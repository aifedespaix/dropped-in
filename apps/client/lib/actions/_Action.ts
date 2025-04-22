import type { _Entity } from '../entities/_Entity';
import type { ActionChannel } from '../types/ActionChannel';

/**
 * Une action est un objet qui exécute une logique d'animation.
 */
export abstract class _Action {
    protected entity!: _Entity;
    protected startedAt: number = 0;
    protected isStarted: boolean = false;

    // À override selon l'action
    abstract start(entity: _Entity): void;
    abstract update?(dt: number): void;
    abstract isComplete(): boolean;
    abstract end?(): void;

    // Optionnel : bloque l’exécution d’autres actions ?
    isBlocking(): boolean {
        return true;
    }

    getChannel(): ActionChannel {
        return "default";
    }
}

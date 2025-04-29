import type { ServiceLocator } from "../core/ServiceLocator";
import type { Entity } from "../entities/Entity";

/**
 * Each system is created by the GameEngine.
 * each system can have a sub-system self created
 * each sub-system is also a _System and is located in a sub-folder named by the owner system name
 */
export abstract class _System {
    protected readonly serviceLocator: ServiceLocator;
    protected readonly entities: Set<Entity> = new Set();
    protected readonly subSystems: Set<_System> = new Set();

    constructor(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    protected updateEntity(entity: Entity, delta: number): void { }
    protected entityFilter(entity: Entity): boolean {
        return false;
    }

    protected onEntityAdded(entity: Entity): void { }

    loadEntities(allEntities: Iterable<Entity>): void {
        this.entities.clear();
        for (const entity of allEntities) {
            if (this.entityFilter(entity)) {
                this.entities.add(entity);
                this.onEntityAdded(entity);
            }
        }
        for (const subSystem of this.subSystems) {
            subSystem.loadEntities(this.entities);
        }
    }

    update(delta: number): void {
        for (const subSystem of this.subSystems) {
            subSystem.update(delta);
        }
        for (const entity of this.entities) {
            this.updateEntity(entity, delta);
        }
    }

    start?(): void;
    load?(): Promise<void>;
    dispose?(): void;
}

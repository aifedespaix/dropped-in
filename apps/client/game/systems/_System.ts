import type { ServiceLocator } from "../core/ServiceLocator";
import type { _Entity } from "../entities/_Entity";

export abstract class _System {
    protected readonly serviceLocator: ServiceLocator;
    protected readonly entities: Set<_Entity> = new Set();

    constructor(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    protected abstract updateEntity(entity: _Entity, delta: number): void;
    protected abstract entityFilter(entity: _Entity): boolean;
    protected onEntityAdded(entity: _Entity): void { }

    loadEntities(all: Iterable<_Entity>): void {
        this.entities.clear();
        for (const entity of all) {
            console.log("loadEntities", this.constructor.name, entity.id, this.entityFilter(entity));
            if (this.entityFilter(entity)) {
                this.entities.add(entity);
                this.onEntityAdded(entity);
            }
        }
    }

    update(delta: number): void {
        for (const entity of this.entities) {
            this.updateEntity(entity, delta);
        }
    }

}

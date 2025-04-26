import { _Entity } from "../entities/_Entity";
import { ServiceLocator } from "../core/ServiceLocator";
import { _System } from "../systems/_System";

export abstract class _Engine {
    protected readonly serviceLocator: ServiceLocator;
    readonly #entities: Set<_Entity> = new Set();
    readonly #systems: Set<_System> = new Set();

    constructor(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    async load(): Promise<void> {

    }

    start(): void { this.loadSystems(); }

    protected abstract entityFilter(_entity: _Entity): boolean;
    protected abstract onEntityAdded(_entity: _Entity): void;
    protected abstract updateEntity(_entity: _Entity, _delta: number): void;

    get entities(): Iterable<_Entity> {
        return this.#entities;
    }

    addEntity(entity: _Entity): boolean {
        const isAccepted = this.entityFilter(entity);
        if (isAccepted) {
            this.#entities.add(entity);
            this.onEntityAdded(entity);
        }
        return isAccepted;
    }

    update(delta: number): void {
        this.updateSystems(delta);
        for (const entity of this.#entities) {
            this.updateEntity(entity, delta);
        }
    }

    loadSystems(): void {
        for (const system of this.#systems) {
            system.loadEntities(this.#entities);
        }
    }

    updateSystems(delta: number): void {
        for (const system of this.#systems) {
            system.update(delta);
        }
    }

    addSystem(system: _System): void {
        this.#systems.add(system);
    }

    clearEntities(): void {
        this.#entities.clear();
    }

}





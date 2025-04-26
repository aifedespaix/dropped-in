import { _Entity } from "../entities/_Entity";

export class EntityManager {
    #entities: Map<string, _Entity> = new Map();

    add(entity: _Entity): void {
        if (this.#entities.has(entity.id)) {
            throw new Error(`Une entité avec l'ID "${entity.id}" existe déjà.`);
        }
        this.#entities.set(entity.id, entity);
    }

    getOrFail<T extends _Entity = _Entity>(id: string): T {
        const entity = this.#get<T>(id);
        if (!entity) {
            throw new Error(`Entité avec l'ID "${id}" introuvable.`);
        }
        return entity;
    }

    tryGet<T extends _Entity = _Entity>(id: string, silent = false): T | undefined {
        const entity = this.#get<T>(id);
        if (!entity && !silent) {
            console.warn(`[EntityManager] Entité introuvable : ${id}`);
        }
        return entity;
    }

    remove(id: string): void {
        this.#entities.delete(id);
    }

    has(id: string): boolean {
        return this.#entities.has(id);
    }

    getAll(): IterableIterator<_Entity> {
        return this.#entities.values();
    }

    clear(): void {
        this.#entities.clear();
    }

    #get<T extends _Entity = _Entity>(id: string): T | undefined {
        return this.#entities.get(id) as T | undefined;
    }

    get size(): number {
        return this.#entities.size;
    }
}

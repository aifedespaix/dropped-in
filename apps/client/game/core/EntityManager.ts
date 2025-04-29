import { Entity } from "../entities/Entity";

export class EntityManager {
    #entities: Map<string, Entity> = new Map();

    add(entity: Entity): void {
        if (this.#entities.has(entity.id)) {
            throw new Error(`Une entité avec l'ID "${entity.id}" existe déjà.`);
        }
        this.#entities.set(entity.id, entity);
    }

    getOrFail<T extends Entity = Entity>(id: string): T {
        const entity = this.#get<T>(id);
        if (!entity) {
            throw new Error(`Entité avec l'ID "${id}" introuvable.`);
        }
        return entity;
    }

    tryGet<T extends Entity = Entity>(id: string, silent = false): T | undefined {
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

    getAll(): Entity[] {
        return Array.from(this.#entities.values());
    }

    clear(): void {
        this.#entities.clear();
    }

    #get<T extends Entity = Entity>(id: string): T | undefined {
        return this.#entities.get(id) as T | undefined;
    }

    get size(): number {
        return this.#entities.size;
    }
}

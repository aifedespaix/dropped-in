import type { _Entity } from "../entities/_Entity";
import { _Component } from "./_Component";

export class CollisionStateComponent extends _Component {
    private collidingEntities: Set<_Entity> = new Set();

    override update(dt: number): void {
        console.log(this.collidingEntities, this.entity?.name);
    }

    add(entity: _Entity) {
        this.collidingEntities.add(entity);
    }

    remove(entity: _Entity) {
        this.collidingEntities.delete(entity);
    }

    getAll(): _Entity[] {
        return [...this.collidingEntities];
    }

    isCollidingWith(tag: string): boolean {
        return [...this.collidingEntities].some(e => e.name === tag);
    }

    clear() {
        this.collidingEntities.clear();
    }
}

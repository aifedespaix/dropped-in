import type { _Builder } from "./_Builder";

export abstract class _BuilderRegistry<TypeMap extends Record<string, any>> {
    #builders: Map<keyof TypeMap, _Builder<any>> = new Map();

    constructor() {
        this.registerDefaultBuilders();
    }

    protected abstract registerDefaultBuilders(): void;

    protected register<K extends keyof TypeMap>(name: K, builder: _Builder<TypeMap[K]>): void {
        this.#builders.set(name, builder);
    }

    get<K extends keyof TypeMap>(name: K): _Builder<TypeMap[K]> {
        return this.#builders.get(name)! as _Builder<TypeMap[K]>;
    }
}

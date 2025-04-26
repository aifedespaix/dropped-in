import type { _Builder } from "../builders/_Builder";

export abstract class _BuilderRegistry<Name extends string, Type> {
    #builders: Map<Name, _Builder<Type>> = new Map();

    constructor() {
        this.registerDefaultBuilders();
    }

    protected abstract registerDefaultBuilders(): void;

    protected register(name: Name, builder: _Builder<Type>): void {
        this.#builders.set(name, builder);
    }

    get(name: Name): _Builder<Type> {
        return this.#builders.get(name)!;
    }
}

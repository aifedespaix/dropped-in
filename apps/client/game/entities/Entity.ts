import { Transform } from "../core/Transform";
import { _Component, ComponentSource, ComponentType } from "../components/_Component";

export class Entity {
    #transform = new Transform();
    #components: Map<Function, _Component> = new Map();

    readonly id: string;

    constructor(id?: string) {
        this.id = id ?? crypto.randomUUID();
    }

    get transform(): Transform {
        return this.#transform;
    }

    addComponentSafe<T extends _Component>(component: T, source: ComponentSource): void {
        const type = component.type;
        if (type === ComponentType.Runtime && source === ComponentSource.Factory) {
            throw new Error(`Le composant "${component.constructor.name}" ne peut pas être ajouté à l'entité ${this.id} car il est de type "${type}" et provient de "${source}"`);
        }
        if (type === ComponentType.Declarative && source === ComponentSource.System) {
            throw new Error(`Le composant "${component.constructor.name}" ne peut pas être ajouté à l'entité ${this.id} car il est de type "${type}" et provient de "${source}"`);
        }
        return this.#addComponent(component);
    }

    getComponent<T extends _Component>(componentClass: new (...args: any[]) => T): T {
        const comp = this.#components.get(componentClass);
        if (!comp) throw new Error(`Le composant "${componentClass.name}" n'existe pas sur l'entité ${this.id}`);
        return comp as T;
    }

    removeComponent(componentClass: new (...args: any[]) => _Component): void {
        this.#components.delete(componentClass);
    }

    tryGetComponent<T extends _Component>(componentClass: new (...args: any[]) => T): T | undefined {
        return this.#components.get(componentClass) as T | undefined;
    }

    hasComponent(componentClass: new (...args: any[]) => _Component): boolean {
        return this.#components.has(componentClass);
    }

    get components(): ReadonlyMap<Function, _Component> {
        return this.#components;
    }

    #addComponent<T extends _Component>(component: T): void {
        if (this.#components.has(component.constructor)) {
            throw new Error(`Le composant "${component.constructor.name}" est déjà ajouté à l'entité ${this.id}`);
        }
        this.#components.set(component.constructor, component);
    }
}

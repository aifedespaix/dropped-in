import { _Component } from '../components/_Component'

let entityIdCounter = 0;

export abstract class _Entity {
    private id: number;
    private components: Map<string, _Component> = new Map();

    abstract init(): Promise<void>;

    constructor() {
        this.id = entityIdCounter++;
    }

    abstract getName(): string;

    getId(): number {
        return this.id;
    }

    async addComponent<T extends _Component>(component: T): Promise<void> {
        const name = component.constructor.name;
        this.components.set(name, component);
        component.entity = this; // association avec l'entité
        await component.init?.();
        component.start?.();
    }

    removeComponent<T extends _Component>(componentClass: new (...args: any[]) => T): void {
        const name = componentClass.name;
        const comp = this.components.get(name);
        if (comp && comp.destroy) comp.destroy(); // cleanup
        this.components.delete(name);
    }

    getComponent<T extends _Component>(componentClass: new (...args: any[]) => T): T {
        const name = componentClass.name;
        const comp = this.components.get(name);
        if (!comp) throw new Error(`Component ${name} not found on entity ${this.id}`);
        return comp as T;
    }

    hasComponent<T extends _Component>(componentClass: new (...args: any[]) => T): boolean {
        return this.components.has(componentClass.name);
    }

    update(dt: number): void {
        for (const component of this.components.values()) {
            if (component.update) {
                component.update(dt);
            }
        }
    }

    tryGetComponent<T extends _Component>(componentClass: new (...args: any[]) => T): T | undefined {
        if (this.hasComponent(componentClass)) {
            return this.getComponent(componentClass);
        }
        console.warn(`Component ${componentClass.name} not found on entity ${this.getName()} ${this.id}`);
        return undefined;
    }

    getComponentsOfType<T extends Component>(
        type: abstract new (...args: any[]) => T
    ): T[] {
        const results: T[] = [];

        for (const component of this.components.values()) {
            if (component instanceof type) {
                results.push(component as T);
            }
        }

        return results;
    }
}

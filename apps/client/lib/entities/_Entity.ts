import { _Component } from '../components/_Component'
import { _RenderComponent } from '../components/render/_RenderComponent';
import type { ServiceLocator } from '../services/ServiceLocator';
import * as THREE from 'three';

/**
 * Une entité est un objet qui possède des composants.
 * 
 * Un composant est un objet qui possède une logique.
 * 
 * Une entité peut avoir plusieurs composants.
 */
export abstract class _Entity {
    static idCounter = 0;
    private id: number;
    private components: Map<string, _Component> = new Map();
    protected serviceLocator: ServiceLocator;

    abstract init(): Promise<void>;

    constructor(serviceLocator: ServiceLocator) {
        this.id = _Entity.idCounter++;
        this.serviceLocator = serviceLocator;
    }

    abstract get name(): string;

    getId(): number {
        return this.id;
    }

    addComponent<T extends _Component>(component: T): void {
        const name = component.constructor.name;
        this.components.set(name, component);
        component.entity = this;
    }

    async initAllComponents(): Promise<void> {
        for (const comp of this.components.values()) {
            await comp.init?.();
        }
    }

    startAllComponents(): void {
        for (const comp of this.components.values()) {
            comp.start?.();
        }
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

    tryGetComponent<T extends _Component>(componentClass: new (...args: any[]) => T, warn = true): T | undefined {
        if (this.hasComponent(componentClass)) {
            return this.getComponent(componentClass);
        }
        if (warn) {
            console.warn(`Component ${componentClass.name} not found on entity ${this.name} ${this.id}`);
        }
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

    getComponents(): _Component[] {
        return Array.from(this.components.values());
    }

    getRenderableObject(): THREE.Object3D | undefined {
        const renderComponent = this.getComponents()?.find(c => c instanceof _RenderComponent);
        return renderComponent?.getObject3D();
    }

    getComponentsByAbstractClass<T extends _Component>(baseClass: new (...args: any[]) => T): T[] {
        const result: T[] = [];
        for (const component of this.components.values()) {
            if (component instanceof baseClass) {
                result.push(component as T);
            }
        }
        return result;
    }

}

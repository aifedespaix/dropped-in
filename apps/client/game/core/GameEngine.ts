import { EntityFactory } from "../factories/Entity.factory";
import { EntityManager } from "./EntityManager";
import { ServiceLocator } from "./ServiceLocator";
import { PhysicsSystem } from "../systems/Physic.system";
import { InputSystem } from "../systems/Input.system";
import { RenderLoop } from "./RenderLoop";
import type { _System } from "../systems/_System";
import { InputService } from "../services/input/Input.service";
import { ResourceService } from "../services/Resource.service";
import { GraphicsSystem } from "../systems/Graphic.system";
import type { Entity } from "../entities/Entity";

export class GameEngine {
    readonly #systems = new Set<_System>();

    readonly #entityFactory = new EntityFactory();
    readonly #entityManager = new EntityManager();
    readonly #serviceLocator = new ServiceLocator();

    readonly #gameLoop: RenderLoop;

    #isInitialized = false;

    constructor(container: HTMLElement) {
        this.#gameLoop = new RenderLoop(this.#update.bind(this));

        this.#serviceLocator.register('input', new InputService());
        this.#serviceLocator.register('resource', new ResourceService());

        this.#systems.add(new InputSystem(this.#serviceLocator));
        this.#systems.add(new PhysicsSystem(this.#serviceLocator));
        this.#systems.add(new GraphicsSystem(this.#serviceLocator, container));
    }

    async load(): Promise<void> {
        await Promise.all(Array.from(this.#systems).map(system => system.load?.() ?? Promise.resolve()));
        this.#generateEntities();
        this.#loadEntitiesIntoSystems();

        for (const system of this.#systems) {
            system.start?.();
        }

        // Effectuer un premier rendu sans démarrer la boucle
        this.#update(0);
    }

    start(): void {
        this.#gameLoop.start();
        this.#isInitialized = true;
    }

    pause(): void {
        this.#gameLoop.pause();
    }

    resume(): void {
        this.#gameLoop.start();
    }

    get isInitialized(): boolean {
        return this.#isInitialized;
    }

    #generateEntities(): void {
        this.#generateEntity(this.#entityFactory.createCube.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createFloor.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createPlayer.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createSphere.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createMovingPlatform.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createRotatingPlatform.bind(this.#entityFactory));
        this.#generateEntity(this.#entityFactory.createRamp.bind(this.#entityFactory));
    }

    #generateEntity<T extends (...args: any[]) => Entity>(
        entityCreator: T,
        ...args: Parameters<T>
    ): void {
        const entity = entityCreator(...args);
        this.#entityManager.add(entity);
    }

    #loadEntitiesIntoSystems(): void {
        const allEntities = this.#entityManager.getAll();
        for (const system of this.#systems) {
            system.loadEntities(allEntities);
        }
    }

    #update(delta: number): void {
        for (const system of this.#systems) {
            system.update(delta);
        }
    }
}

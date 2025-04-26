import { GraphicEngine } from "../engines/graphic/Graphic.engine";
import { PhysicEngine } from "../engines/physic/Physic.engine";
import { RenderLoop } from "./RenderLoop";
import { EntityManager } from "./EntityManager";
import { NetworkEngine } from "../engines/network/Network.engine";
import { LocalEngine } from "../engines/local/Local.engine";
import type { _Engine } from "../engines/_Engine";
import { EntityFactory } from "../factories/Entity.factory";
import type { _Entity } from "../entities/_Entity";
import { InputSystem } from "../systems/Input.system";
import { ServiceLocator } from "./ServiceLocator";
import { InputService } from "../services/input/Input.service";
import { ResourceService } from "../services/Resource.service";

export class GameEngine {
    readonly #engines = new Set<_Engine>();

    readonly #entityFactory = new EntityFactory();
    readonly #entityManager = new EntityManager();
    readonly #serviceLocator = new ServiceLocator();

    readonly #inputSystem = new InputSystem(this.#serviceLocator);

    readonly #gameLoop: RenderLoop;

    #isInitialized = false;

    constructor(container: HTMLElement) {
        this.#gameLoop = new RenderLoop(this.#update.bind(this));

        this.#serviceLocator.register('input', new InputService());
        this.#serviceLocator.register('resource', new ResourceService());

        // Attention, l'ordre des moteurs est important
        this.#engines.add(new LocalEngine(this.#serviceLocator));
        this.#engines.add(new PhysicEngine(this.#serviceLocator));
        this.#engines.add(new NetworkEngine(this.#serviceLocator))
        this.#engines.add(new GraphicEngine(this.#serviceLocator, container));

    }


    load(): Promise<void[]> {
        return Promise.all(
            Array.from(this.#engines).map(engine => engine.load()),
        );
    }

    start(): void {
        this.#generateEntities();
        this.#addEntitiesToEngines();

        this.#inputSystem.loadEntities(this.#entityManager.getAll());
        for (const engine of this.#engines) {
            engine.start();
        }


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
    }

    #generateEntity<T extends (...args: any[]) => _Entity>(
        entityCreator: T,
        ...args: Parameters<T>
    ): void {
        const entity = entityCreator(...args);
        this.#entityManager.add(entity);
    }

    #addEntitiesToEngines(): void {
        const allEntities = this.#entityManager.getAll();

        for (const entity of allEntities) {
            for (const engine of this.#engines) {
                engine.addEntity(entity);
            }
        }
    }

    #update(delta: number): void {
        this.#inputSystem.update(delta);
        for (const engine of this.#engines) {
            engine.update(delta);
        }
    }
}

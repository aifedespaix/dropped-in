import { SceneManager } from '../core/SceneManager';
import { ActionManager } from '../core/ActionManager';
import { ThreeRenderService } from '../services/ThreeRenderService';
import { RapierPhysicsService } from '../services/RapierPhysicsService';
import { ServiceLocator, type ServiceKey, type ServiceMap } from '../services/ServiceLocator';
import { InputService } from '../services/InputService';
import { RenderLoop } from './RenderLoop';

export class GameEngine {
    private actionManager: ActionManager;
    private serviceLocator: ServiceLocator;

    // Delayed initialization
    private renderLoop!: RenderLoop;
    private sceneManager!: SceneManager;


    constructor(private target: HTMLElement) {
        this.target = target;

        this.serviceLocator = new ServiceLocator();
        this.actionManager = ActionManager.getInstance();
    }

    public async init(): Promise<void> {
        console.log("[GameEngine] Initializing...");
        await this.registerServices();
        this.initSceneManager();
        this.initRenderLoop();
    }

    private initSceneManager(): void {
        this.sceneManager = new SceneManager(this.serviceLocator);
        this.sceneManager.loadInitialScene();
    }

    private async registerServices(): Promise<void> {
        const promises: Promise<void>[] = [];
        const renderService = new ThreeRenderService(this.target);
        promises.push(this.registerService('render', renderService));

        const physicsService = new RapierPhysicsService();
        promises.push(this.registerService('physics', physicsService));

        const inputService = new InputService();
        promises.push(this.registerService('input', inputService));

        await Promise.all(promises);
    }

    private async registerService(name: ServiceKey, service: ServiceMap[ServiceKey]): Promise<void> {
        this.serviceLocator.register(name, service);
        await service.init();
    }

    private initRenderLoop(): void {
        this.renderLoop = new RenderLoop(
            this.update.bind(this),
            this.render.bind(this),
            30
        );
    }

    private update(dt: number): void {
        const physicsService = this.serviceLocator.get('physics');
        physicsService.step();

        const inputService = this.serviceLocator.get('input');
        inputService.update(dt);

        this.actionManager.update(dt);
        this.sceneManager.update(dt);
    }

    private render(): void {
        this.sceneManager.render();
    }

    public stop(): void {
        this.renderLoop.stop();
    }

    public start(): void {
        this.renderLoop.start();
    }
}

// core/GameEngine.ts

import { SceneManager } from '../core/SceneManager';
import { InputManager } from '../core/InputManager';
import { ActionManager } from '../core/ActionManager';
import { _Entity } from '../entities/_Entity';
import { ThreeRenderService } from '../services/ThreeRenderService';
import { RapierPhysicsService } from '../services/RapierPhysicsService';

export class GameEngine {
    private sceneManager!: SceneManager;
    private inputManager: InputManager;
    private actionManager: ActionManager;
    private physicsService: RapierPhysicsService;
    private renderService: ThreeRenderService;
    // private networkManager: NetworkManager;
    // private aiController: AIController;

    private entities: _Entity[] = [];
    private lastUpdateTime: number = performance.now();
    private running: boolean = false;
    private target: HTMLElement;

    constructor(target: HTMLElement) {
        this.target = target;

        this.physicsService = new RapierPhysicsService();
        this.renderService = new ThreeRenderService(this.target);
        this.inputManager = InputManager.getInstance();
        this.actionManager = ActionManager.getInstance();
        // this.networkManager = new NetworkManager();
        // this.aiController = new AIController();
    }

    public async init(): Promise<void> {
        console.log("[GameEngine] Initializing...");
        await this.physicsService.init();

        this.sceneManager = new SceneManager(this.renderService);
        await this.sceneManager.loadInitialScene(this.physicsService);

        this.entities = this.sceneManager.getEntities();
        this.inputManager.init();
        // this.networkManager.init();

        this.running = true;
        requestAnimationFrame(this.boundLoop);
    }

    private gameLoop(currentTime: number): void {
        const dt = (currentTime - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = currentTime;

        this.update(dt);
        this.render();

        if (this.running) {
            requestAnimationFrame(this.boundLoop);
        }
    }

    private boundLoop = this.gameLoop.bind(this);


    private update(dt: number): void {
        this.physicsService.step();
        this.inputManager.update(dt);
        // this.networkManager.update(dt);
        // this.aiController.update(dt);
        this.actionManager.update(dt);
        this.sceneManager.update(dt);
    }

    private render(): void {
        this.sceneManager.render();
    }

    public stop(): void {
        this.running = false;
    }

    public getSceneManager(): SceneManager {
        return this.sceneManager;
    }

    public getInputManager(): InputManager {
        return this.inputManager;
    }

    public getActionManager(): ActionManager {
        return this.actionManager;
    }

    // public getNetworkManager(): NetworkManager {
    // return this.networkManager;
    // }
    // 
    // public getAIController(): AIController {
    // return this.aiController;
    // }

    public addEntity(entity: _Entity): void {
        this.entities.push(entity);
    }
}

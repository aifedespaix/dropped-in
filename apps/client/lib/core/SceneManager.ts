import { _RenderComponent } from "../components/render/_RenderComponent";
import { TransformComponent } from "../components/transform/TransformComponent";
import type { _Entity } from "../entities/_Entity";
import { CubeEntity } from "../entities/CubeEntity";
import { FloorEntity } from "../entities/FloorEntity";
import { PlatformEntity } from "../entities/PlatformEntity";
import { PlayerEntity } from "../entities/PlayerEntity";
import { PusherEntity } from "../entities/PusherEntity";
import { RampEntity } from "../entities/RampEntity";
import type { ServiceLocator } from "../services/ServiceLocator";
import type { _System } from "../systems/_System";
import { CollisionSystem } from "../systems/CollisionSystem";
import { PlatformFollowerSystem } from "../systems/PlatformFollowerSystem";
export class SceneManager {
    private entities: _Entity[] = [];
    private systems: _System[] = [];
    private serviceLocator: ServiceLocator;

    constructor(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    async loadInitialScene() {
        const player = new PlayerEntity(this.serviceLocator);
        const cube = new CubeEntity(this.serviceLocator);
        const floor = new FloorEntity(this.serviceLocator);
        const pusher = new PusherEntity(this.serviceLocator);
        const ramp = new RampEntity(this.serviceLocator);
        const platform = new PlatformEntity(this.serviceLocator);

        const promises: Promise<void>[] = [];
        promises.push(this.addEntity(player));
        promises.push(this.addEntity(cube));
        promises.push(this.addEntity(floor));
        promises.push(this.addEntity(pusher));
        promises.push(this.addEntity(ramp));
        promises.push(this.addEntity(platform));
        await Promise.all(promises);

        floor.getComponent(TransformComponent).position.y = -2;
        await this.addSystems();
    }

    private async addSystems() {
        const player = this.entities.find(entity => entity instanceof PlayerEntity);
        if (!player) throw new Error('Player not found');

        const collisionSystem = new CollisionSystem(this.serviceLocator, player, this.entities);
        await this.addSystem(collisionSystem);

        const platformFollowerSystem = new PlatformFollowerSystem(player, this.entities);
        await this.addSystem(platformFollowerSystem);
    }

    private async addSystem(system: _System) {
        // system.init?.(); // not needed at the moment
        this.systems.push(system);
    }

    private async addEntity(entity: _Entity) {
        await entity.init();
        this.entities.push(entity);
    }

    getEntities(): _Entity[] {
        return this.entities;
    }

    update(dt: number) {
        for (const entity of this.entities) {
            entity.update(dt);
        }
        for (const system of this.systems) {
            system.update(dt);
        }
    }

    render() {
        for (const entity of this.entities) {
            const renderComponents = entity.getComponentsOfType(_RenderComponent);
            for (const render of renderComponents) {
                render.render();
            }
        }
        this.serviceLocator.get('render').render();
    }
}

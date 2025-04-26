import { _RenderComponent } from "../components/render/_RenderComponent";
import type { _Entity } from "../entities/_Entity";
import { CubeEntity } from "../entities/dynamic/CubeEntity";
import { FloorEntity } from "../entities/fixed/FloorEntity";
import { PlatformEntity } from "../entities/kinematicVelocityBased/PlatformEntity";
import { PlayerEntity } from "../entities/kinematicPositionBased/Player.entity";
import { PusherEntity } from "../entities/kinematicVelocityBased/PusherEntity";
import { RampEntity } from "../entities/fixed/RampEntity";
import type { ServiceLocator } from "../services/ServiceLocator";
import type { _System } from "../systems/_System";
import { CollisionSystem } from "../systems/CollisionSystem";
import { CameraSystem } from "../systems/CameraSystem";
import { ElevatorEntity } from "../entities/kinematicVelocityBased/Elevator.entity";
import { PlatformAttachSystem } from "../systems/PlatformAttachSystem";

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
        const elevator = new ElevatorEntity(this.serviceLocator);

        const promises: Promise<void>[] = [];
        promises.push(this.addEntity(player));
        promises.push(this.addEntity(cube));
        promises.push(this.addEntity(floor));
        promises.push(this.addEntity(pusher));
        promises.push(this.addEntity(ramp));
        promises.push(this.addEntity(platform));
        promises.push(this.addEntity(elevator));
        await Promise.all(promises);

        await this.addSystems();
    }


    private async addSystems() {
        const player = this.entities.find(entity => entity instanceof PlayerEntity);
        if (!player) throw new Error('Player not found');

        const collisionSystem = new CollisionSystem(this.serviceLocator, player, this.entities);
        await this.addSystem(collisionSystem);

        // const platformAttachSystem = new PlatformAttachSystem(this.serviceLocator, player, this.entities);
        // await this.addSystem(platformAttachSystem);

        const cameraSystem = new CameraSystem(this.serviceLocator, player);
        await this.addSystem(cameraSystem);
    }

    private async addSystem(system: _System) {
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

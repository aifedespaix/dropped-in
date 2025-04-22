// core/SceneManager.ts (exemple simple)

import { _RenderComponent } from "../components/render/_RenderComponent";
import { TransformComponent } from "../components/transform/TransformComponent";
import type { _Entity } from "../entities/_Entity";
import { CubeEntity } from "../entities/CubeEntity";
import { FloorEntity } from "../entities/FloorEntity";
import { PlayerEntity } from "../entities/PlayerEntity";
import type { ThreeRenderService } from "../services/ThreeRenderService";
import type { RapierPhysicsService } from "../services/RapierPhysicsService";

export class SceneManager {
    private entities: _Entity[] = [];
    private renderService: ThreeRenderService;

    constructor(renderService: ThreeRenderService) {
        this.renderService = renderService;
    }

    async loadInitialScene(physics: RapierPhysicsService) {
        const player = new PlayerEntity(this.renderService, physics);
        const cube = new CubeEntity(this.renderService);
        const floor = new FloorEntity(this.renderService, physics);

        const promises: Promise<void>[] = [];
        promises.push(player.init());
        promises.push(cube.init());
        promises.push(floor.init());
        await Promise.all(promises);

        floor.getComponent(TransformComponent).position.y = -2;
        // const npc = new NPCEntity();

        this.entities.push(player, cube, floor);
    }

    getEntities(): _Entity[] {
        return this.entities;
    }

    update(dt: number) {
        for (const entity of this.entities) {
            entity.update(dt);
        }
    }

    render() {
        for (const entity of this.entities) {
            const renderComponents = entity.getComponentsOfType(_RenderComponent);
            for (const render of renderComponents) {
                render.render();
            }
        }
        this.renderService.render();
    }
}

import { _RenderComponent } from "../components/render/_RenderComponent";
import { _Entity } from "./_Entity";
import { ThreeRenderService } from "../services/ThreeRenderService";
import { TransformComponent } from "../components/transform/TransformComponent";
import { RotatorComponent } from "../components/animations/RotatorComponent";
import { PrimitiveRenderComponent } from "../components/render/PrimitiveRenderComponent";

export class CubeEntity extends _Entity {
    private renderService: ThreeRenderService;

    constructor(renderService: ThreeRenderService) {
        super();
        this.renderService = renderService;
    }

    async init(): Promise<void> {
        const promises: Promise<void>[] = [];
        promises.push(this.addComponent(new PrimitiveRenderComponent(this.renderService, 'box')));
        promises.push(this.addComponent(new TransformComponent()));
        promises.push(this.addComponent(new RotatorComponent()));

        await Promise.all(promises);
    }

    getName(): string {
        return "Cube";
    }
}
import { ActionComponent } from "../components/ActionComponent";
import { _RenderComponent } from "../components/render/_RenderComponent";
import { TransformComponent } from "../components/transform/TransformComponent";
import { _Entity } from "./_Entity";

class NPCEntity extends _Entity {
    constructor() {
        super();
        this.addComponent(new TransformComponent());
        this.addComponent(new ActionComponent());
    }

    async init(): Promise<void> {
        const promises: Promise<void>[] = [];
        promises.push(this.addComponent(new TransformComponent()));
        promises.push(this.addComponent(new ActionComponent()));

        await Promise.all(promises);
    }

    override update(dt: number) {
        // this.getComponent(AIComponent    ).update(dt);
        this.getComponent(ActionComponent).update(dt);
    }

    getName(): string {
        return "NPC";
    }
}

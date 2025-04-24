import { _RenderComponent } from "../components/render/_RenderComponent";
import { _Entity } from "./_Entity";
import { RotatorComponent } from "../components/animations/RotatorComponent";
import { PrimitiveRenderComponent } from "../components/render/PrimitiveRenderComponent";
import { RapierPhysicsComponent, type RapierPhysicsComponentOptions } from "../components/physics/RapierPhysicsComponent";
import { PhysicRotationComponent } from "../components/physics/PhysicRotationComponent";
import { HitboxSquareComponent } from "../components/hitbox/HitBoxSquareComponent";
import { HitboxHelperComponent } from "../components/helpers/HitboxHelperComponent";
import { TransformComponent } from "../components/transform/TransformComponent";

export class CubeEntity extends _Entity {

    async init(): Promise<void> {
        const cubeOptions: Partial<RapierPhysicsComponentOptions> = {
            position: { x: -5, y: 0, z: -5 },
        }
        this.addComponent(new PrimitiveRenderComponent(this.serviceLocator, { type: 'box' }));
        this.addComponent(new RotatorComponent(this.serviceLocator));
        this.addComponent(new RapierPhysicsComponent(this.serviceLocator, cubeOptions));
        this.addComponent(new HitboxSquareComponent(this.serviceLocator));
        this.addComponent(new HitboxHelperComponent(this.serviceLocator));
        this.addComponent(new PhysicRotationComponent(this.serviceLocator));
        this.addComponent(new TransformComponent(this.serviceLocator));

        await this.initAllComponents();
        this.startAllComponents();
    }

    get name(): string {
        return "Cube";
    }
}
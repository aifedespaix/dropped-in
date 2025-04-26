import { _Engine } from "../_Engine";
import { _Entity } from "~/game/entities/_Entity";
import { PhysicsBodyComponent } from "~/game/components/declarative/PhysicBody.component";
import { HitboxCubeComponent } from "~/game/components/declarative/HitboxCube.component";
import { PhysicsInstanceComponent } from "~/game/components/physic/PhysicInstance.component";
import { ComponentSource } from "~/game/components/_Component";
import { ColliderDesc, init as initRapier, RigidBodyDesc, Vector3, World, KinematicCharacterController } from "@dimforge/rapier3d-compat";
import { KinematicMovementSystem } from "~/game/systems/KinematicMovement.system";
import { GRAVITY } from "~/game/constants";

export class PhysicEngine extends _Engine {
    #world!: World;
    #kinematicCharacterController!: KinematicCharacterController

    readonly #gravity = new Vector3(0, GRAVITY, 0);

    override async load(): Promise<void> {
        await super.load();
        await initRapier();
        this.#world = new World(this.#gravity);
        this.#kinematicCharacterController = this.#world.createCharacterController(0.01);
        this.addSystem(new KinematicMovementSystem(this.serviceLocator, this.#world, this.#kinematicCharacterController));
    }

    protected entityFilter(_entity: _Entity): boolean {
        return _entity.hasComponent(PhysicsBodyComponent) && _entity.hasComponent(HitboxCubeComponent);
    }

    protected onEntityAdded(entity: _Entity): void {
        const bodyComp = entity.getComponent(PhysicsBodyComponent);
        const hitboxComp = entity.getComponent(HitboxCubeComponent);

        const desc = new RigidBodyDesc(bodyComp.rigidBodyType)
            .setTranslation(...entity.transform.position.toArray());

        const body = this.#world.createRigidBody(desc);

        const collider = this.#world.createCollider(
            ColliderDesc.cuboid(
                hitboxComp.size[0] / 2,
                hitboxComp.size[1] / 2,
                hitboxComp.size[2] / 2
            )
                .setRestitution(hitboxComp.restitution)
                .setFriction(hitboxComp.friction),
            body
        );

        entity.addComponentSafe(
            new PhysicsInstanceComponent(body.handle, collider.handle),
            ComponentSource.Engine
        );

    }

    override update(delta: number): void {
        super.update(delta);
        this.#world.step();
    }

    protected updateEntity(entity: _Entity, delta: number): void {
        const instance = entity.getComponent(PhysicsInstanceComponent);
        const body = this.#world.getRigidBody(instance.rigidBody);
        const pos = body.translation();
        const rot = body.rotation();

        entity.transform.setPosition([pos.x, pos.y, pos.z]);
        entity.transform.setRotation(rot);
    }
}

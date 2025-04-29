import type { Collider, ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat";
import { _BuilderRegistry } from "./_BuilderRegistry";
import { BodyBuilder } from "./physic/Body.builder";
import { ColliderBuilder } from "./physic/Collider.builder";

export type PhysicBuilderTypeMap = {
    Collider: ColliderDesc;
    Body: RigidBodyDesc;
};

export class PhysicBuilderRegistry extends _BuilderRegistry<PhysicBuilderTypeMap> {
    protected registerDefaultBuilders(): void {
        this.register("Collider", new ColliderBuilder());
        this.register("Body", new BodyBuilder());
    }
}

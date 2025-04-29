import { _Component, ComponentType } from "../_Component";
import type { RigidBodyHandle, ColliderHandle, ColliderDesc } from "@dimforge/rapier3d-compat";

export class PhysicsInstanceComponent extends _Component {
    readonly rigidBody: RigidBodyHandle;
    readonly collider: ColliderHandle;
    readonly colliderDesc: ColliderDesc;

    constructor(rigidBody: RigidBodyHandle, collider: ColliderHandle, colliderDesc: ColliderDesc) {
        super(ComponentType.Runtime);
        this.rigidBody = rigidBody;
        this.collider = collider;
        this.colliderDesc = colliderDesc;
    }
}

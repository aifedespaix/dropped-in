import { _Component, ComponentType } from "../_Component";
import type { RigidBodyHandle, ColliderHandle } from "@dimforge/rapier3d-compat";

export class PhysicsInstanceComponent extends _Component {
    readonly rigidBody: RigidBodyHandle;
    readonly collider: ColliderHandle;

    constructor(rigidBody: RigidBodyHandle, collider: ColliderHandle) {
        super(ComponentType.Runtime);
        this.rigidBody = rigidBody;
        this.collider = collider;
    }
}

import { _Component, ComponentType } from "../_Component";
import { RigidBodyType } from "@dimforge/rapier3d-compat";

export class PhysicsBodyComponent extends _Component {
    readonly rigidBodyType: RigidBodyType;
    readonly mass: number;

    constructor(rigidBodyType: RigidBodyType = RigidBodyType.Dynamic, mass: number = 1) {
        super(ComponentType.Declarative);
        this.rigidBodyType = rigidBodyType;
        this.mass = mass;
    }
}

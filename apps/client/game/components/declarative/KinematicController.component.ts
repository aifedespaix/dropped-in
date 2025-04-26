import { _Component, ComponentType } from "../_Component";
import type { Vector3Tuple } from "three";

export class KinematicControllerComponent extends _Component {
    targetPosition: Vector3Tuple;

    constructor(initialTarget: Vector3Tuple) {
        super(ComponentType.Declarative);
        this.targetPosition = initialTarget;
    }

    setTarget(x: number, y: number, z: number): void {
        this.targetPosition = [x, y, z];
    }
}

import { _Component } from "../_Component";
import { ComponentType } from "../_Component";

export class KinematicGravityComponent extends _Component {
    velocityY: number = 0;
    readonly gravity: number;
    readonly jumpForce: number;

    constructor(gravity = -9.81, jumpForce = 4.5) {
        super(ComponentType.Declarative);
        this.gravity = gravity;
        this.jumpForce = jumpForce;
    }

    reset(): void {
        this.velocityY = 0;
    }
}

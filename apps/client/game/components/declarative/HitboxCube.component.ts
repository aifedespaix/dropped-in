import { _Component, ComponentType } from "../_Component";
import type { ISize } from "~/game/types/I3D";

export class HitboxCubeComponent extends _Component {
    readonly size: ISize;
    readonly restitution: number;
    readonly friction: number;

    constructor(size: ISize, restitution: number, friction: number) {
        super(ComponentType.Declarative);
        this.size = size;
        this.restitution = restitution;
        this.friction = friction;
    }
}

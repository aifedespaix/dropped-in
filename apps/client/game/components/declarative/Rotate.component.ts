import { _Component, ComponentType } from "~/game/components/_Component";
import type { IAxis } from "~/game/types/I3D";

export class RotateComponent extends _Component {
    readonly axis: IAxis;
    readonly speed: number;

    constructor(
        axis: IAxis,
        speed: number,
    ) {
        super(ComponentType.Declarative);
        this.axis = axis;
        this.speed = speed;
    }
}

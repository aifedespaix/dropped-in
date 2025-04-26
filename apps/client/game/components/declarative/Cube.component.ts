import type { ISize } from "~/game/types/I3D";
import { _Component, ComponentType } from "../_Component";

export class CubeComponent extends _Component {
    readonly size: ISize;
    readonly color: number;
    readonly wireframe: boolean;

    constructor(size: ISize, color: number = 0xffffff, wireframe: boolean = false) {
        super(ComponentType.Declarative);
        this.size = size;
        this.color = color;
        this.wireframe = wireframe;
    }
}
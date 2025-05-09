import type { ISize } from "~/game/types/I3D";
import { _Component, ComponentType } from "../_Component";
import type { MaterialType } from "~/game/factories/Material.factory";


export class CubeComponent extends _Component {
    readonly size: ISize;
    readonly color: number;
    readonly wireframe: boolean;
    readonly materialType: MaterialType;
    readonly materialOptions?: any;

    constructor(
        size: ISize,
        color: number = 0xffffff,
        wireframe: boolean = false,
        materialType: MaterialType = 'standard',
        materialOptions?: any
    ) {
        super(ComponentType.Declarative);
        this.size = size;
        this.color = color;
        this.wireframe = wireframe;
        this.materialType = materialType;
        this.materialOptions = materialOptions;
    }
}

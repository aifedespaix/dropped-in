import { _Component, ComponentType } from "../_Component";
import type { MaterialType } from "~/game/factories/Material.factory";

export class SphereComponent extends _Component {
    readonly radius: number;
    readonly color: number;
    readonly wireframe: boolean;
    readonly materialType: MaterialType;
    readonly materialOptions?: any;

    constructor(
        radius: number,
        color: number = 0xffffff,
        wireframe: boolean = false,
        materialType: MaterialType = 'standard',
        materialOptions?: any
    ) {
        super(ComponentType.Declarative);
        this.radius = radius;
        this.color = color;
        this.wireframe = wireframe;
        this.materialType = materialType;
        this.materialOptions = materialOptions;
    }
}

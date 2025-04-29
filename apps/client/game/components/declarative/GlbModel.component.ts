import { ComponentType } from "../_Component";

import { _Component } from "../_Component";

export class GlbModelComponent extends _Component {
    readonly modelPath: string;
    readonly scale: [number, number, number];

    constructor(modelPath: string, scale: [number, number, number] = [1, 1, 1]) {
        super(ComponentType.Declarative);
        this.modelPath = modelPath;
        this.scale = scale;
    }
}

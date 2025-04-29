import { _Component, ComponentType } from "../_Component";

export class RotationRequestComponent extends _Component {
    public yawDelta: number = 0;

    constructor() {
        super(ComponentType.Declarative);
    }

    reset(): void {
        this.yawDelta = 0;
    }
}

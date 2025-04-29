import { _Component, ComponentType } from "../_Component";

export type HitboxType = 'box' | 'sphere' | 'capsule' | 'convexHull'; // (d'autres plus tard si besoin)

export class HitboxComponent extends _Component {
    readonly restitution: number;
    readonly friction: number;
    readonly forcedType?: HitboxType;

    constructor(restitution: number, friction: number, forcedType?: HitboxType) {
        super(ComponentType.Declarative);
        this.restitution = restitution;
        this.friction = friction;
        this.forcedType = forcedType;
    }
}

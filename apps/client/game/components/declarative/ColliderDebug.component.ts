import { ComponentType } from '../_Component';
import { _Component } from '../_Component';

/**
 * Demande à ce que le collider physique associé à l'entité soit visualisé par une mesh wireframe.
 */
export class ColliderDebugComponent extends _Component {
    readonly color: number;

    constructor(color: number = 0x00ff00) {
        super(ComponentType.Declarative);
        this.color = color;
    }
}

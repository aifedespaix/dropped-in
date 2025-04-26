import { _Component } from '../_Component';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { RapierPhysicsComponent } from './RapierPhysicsComponent';
import type { ServiceLocator } from '../../services/ServiceLocator';

export type ElevatorComponentOptions = {
    from: RAPIER.Vector3;
    to: RAPIER.Vector3;
    speed: number; // en unités par seconde
};

export class ElevatorComponent extends _Component {
    private _options: ElevatorComponentOptions;
    private _direction: 1 | -1 = 1;
    private _progress: number = 0;

    constructor(serviceLocator: ServiceLocator, options: ElevatorComponentOptions) {
        super(serviceLocator);
        this._options = options;
    }

    override start(): void {
        const physics = this.entity?.getComponent(RapierPhysicsComponent);
        if (!physics) return;

        physics.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    }

    override update(dt: number): void {
        const physics = this.entity?.getComponent(RapierPhysicsComponent);
        if (!physics) return;

        const { from, to, speed } = this._options;

        // Avancement dans le temps
        this._progress += dt * speed * this._direction;

        if (this._progress >= 1) {
            this._progress = 1;
            this._direction = -1;
        } else if (this._progress <= 0) {
            this._progress = 0;
            this._direction = 1;
        }

        // Interpolation linéaire entre from et to
        const currentPos = new RAPIER.Vector3(
            from.x + (to.x - from.x) * this._progress,
            from.y + (to.y - from.y) * this._progress,
            from.z + (to.z - from.z) * this._progress
        );

        physics.body.setNextKinematicTranslation(currentPos);
    }
}

import { _Animation } from '../animations/_Animation';
import { RapierPhysicsComponent } from './RapierPhysicsComponent';
import type { ServiceLocator } from '../../services/ServiceLocator';
import { _Component } from '../_Component';
import * as RAPIER from '@dimforge/rapier3d-compat';

export type RotatorComponentOptions = {
    speedX: number;
    speedY: number;
    speedZ: number;
}

export class PhysicRotationComponent extends _Component {
    private _options: RotatorComponentOptions;

    constructor(serviceLocator: ServiceLocator, options?: Partial<RotatorComponentOptions>) {
        super(serviceLocator);
        this._options = {
            speedX: 0,
            speedY: 5,
            speedZ: 0,
            ...options,
        };
    }

    override start(): void {
        const physics = this.entity?.getComponent(RapierPhysicsComponent);

        // Pas de freinage de rotation
        physics.body.setAngularDamping(0);
        physics.body.setEnabledTranslations(false, false, false, true);

        // Rotation seulement sur les axes nécessaires
        physics.body.setEnabledRotations(
            this._options.speedX !== 0,
            this._options.speedY !== 0,
            this._options.speedZ !== 0,
            true
        );

        // Appliquer une vitesse angulaire stable dès le départ
        const angularVelocity = new RAPIER.Vector3(
            this._options.speedX,
            this._options.speedY,
            this._options.speedZ
        );
        physics.body.setAngvel(angularVelocity, true);
    }

}

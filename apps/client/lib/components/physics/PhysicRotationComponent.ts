import { _Component } from '../_Component';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { RapierPhysicsComponent } from './RapierPhysicsComponent';
import type { ServiceLocator } from '../../services/ServiceLocator';

export type RotatorComponentOptions = {
    speedX: number;
    speedY: number;
    speedZ: number;
    radius: number; // distance approx. du centre de rotation au perso
}

export class PhysicRotationComponent extends _Component {
    private _options: RotatorComponentOptions;
    private _lastPosition: RAPIER.Vector3 | null = null;

    constructor(serviceLocator: ServiceLocator, options?: Partial<RotatorComponentOptions>) {
        super(serviceLocator);
        this._options = {
            speedX: 0,
            speedY: 5,
            speedZ: 0,
            radius: 2,
            ...options,
        };
    }

    override start(): void {
        const physics = this.entity?.getComponent(RapierPhysicsComponent);
        if (!physics) return;

        physics.body.setAngularDamping(0);
        physics.body.setEnabledTranslations(false, false, false, true);

        physics.body.setEnabledRotations(
            this._options.speedX !== 0,
            this._options.speedY !== 0,
            this._options.speedZ !== 0,
            true
        );

        const angularVelocity = new RAPIER.Vector3(
            this._options.speedX,
            this._options.speedY,
            this._options.speedZ
        );
        physics.body.setAngvel(angularVelocity, true);
    }

    override update(dt: number): void {
        const physics = this.entity?.getComponent(RapierPhysicsComponent);
        if (!physics) return;

        const angVel = physics.body.angvel();
        const radius = this._options.radius;

        // Vecteur de rayon (ex: point situé à `radius` sur X)
        const r = new RAPIER.Vector3(radius, 0, 0);

        // Produit vectoriel : v = ω × r

        const linVel = {
            x: angVel.y * r.z - angVel.z * r.y,
            y: angVel.z * r.x - angVel.x * r.z,
            z: angVel.x * r.y - angVel.y * r.x,
        };

        physics.body.setLinvel(linVel, true);
    }
}

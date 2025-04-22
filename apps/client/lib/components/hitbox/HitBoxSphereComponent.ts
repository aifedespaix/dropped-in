import type { ServiceLocator } from '~/lib/services/ServiceLocator';
import { _HitboxComponent } from './_HitboxComponent';
import * as RAPIER from '@dimforge/rapier3d-compat';

type HitboxSphereOptions = {
    radius: number;
};

export class HitboxSphereComponent extends _HitboxComponent {
    private options: HitboxSphereOptions;

    constructor(serviceLocator: ServiceLocator, options?: Partial<HitboxSphereOptions>) {
        super(serviceLocator);
        this.options = {
            radius: 0.5,
            ...options,
        };
    }

    getColliderDesc(): RAPIER.ColliderDesc {
        return RAPIER.ColliderDesc.ball(this.options.radius)
            .setRestitution(0.1)
            .setFriction(0.5);
    }
}

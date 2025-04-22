import type { ServiceLocator } from '~/lib/services/ServiceLocator';
import { _HitboxComponent } from './_HitboxComponent';
import * as RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export class HitboxSquareComponent extends _HitboxComponent {
    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    getColliderDesc(): RAPIER.ColliderDesc {
        const object3D = this.entity?.getRenderableObject?.(); // méthode à implémenter dans Entity

        if (!object3D) {
            console.warn('[HitboxSquareComponent] No renderable object found for auto-sizing');
            return RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5); // fallback
        }

        const box = new THREE.Box3().setFromObject(object3D);
        const size = box.getSize(new THREE.Vector3());
        const half = size.multiplyScalar(0.5);

        return RAPIER.ColliderDesc.cuboid(half.x, half.y, half.z)
            .setRestitution(0.1)
            .setFriction(0.5);
    }

    getSize(): THREE.Vector3 {
        const object3D = this.entity?.getRenderableObject?.();
        if (!object3D) return new THREE.Vector3(1, 1, 1);

        const box = new THREE.Box3().setFromObject(object3D);
        return box.getSize(new THREE.Vector3());
    }
}

import type { ServiceLocator } from '~/lib/services/ServiceLocator';
import { _HitboxComponent } from './_HitboxComponent';
import * as RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export class HitboxCapsuleComponent extends _HitboxComponent {
    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    getColliderDesc(): RAPIER.ColliderDesc {
        const object3D = this.entity?.getRenderableObject?.();
        if (!object3D) {
            console.warn('[HitboxCapsuleComponent] No renderable object found for auto-sizing');
            return RAPIER.ColliderDesc.capsule(0.5, 0.25); // fallback
        }

        const box = new THREE.Box3().setFromObject(object3D);
        const size = box.getSize(new THREE.Vector3());

        const radius = Math.min(size.x, size.z) / 2; // on suppose Y = up
        const height = size.y - 2 * radius;
        const halfHeight = Math.max(height / 2, 0.01); // pour éviter une capsule plate

        return RAPIER.ColliderDesc.capsule(halfHeight, radius)
            .setRestitution(0.1)
            .setFriction(0.5);
    }

    getSize(): THREE.Vector3 {
        const object3D = this.entity?.getRenderableObject?.();
        if (!object3D) return new THREE.Vector3(1, 2, 1); // valeur typique capsule

        const box = new THREE.Box3().setFromObject(object3D);
        return box.getSize(new THREE.Vector3());
    }
}

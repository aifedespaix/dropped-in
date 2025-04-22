import { describe, it, expect, beforeEach } from 'vitest';
import * as THREE from 'three';

import { RapierPhysicsService } from '../services/RapierPhysicsService';
import { RapierPhysicsComponent } from '../components/physics/RapierPhysicsComponent';

describe('BoundingBox & Collider Sync', () => {
    let physics: RapierPhysicsService;

    beforeEach(async () => {
        physics = new RapierPhysicsService();
        await physics.init(); // On attend que l'initialisation soit terminée
    });

    it('should match bounding box helper with Rapier collider', async () => {
        // Setup Rapier component
        const component = new RapierPhysicsComponent(
            { get: () => physics } as any, // mock minimal du ServiceLocator
            {
                size: { x: 2, y: 1, z: 1 },
                position: { x: 0, y: 0, z: 0 },
            }
        );

        await component.start(); // On attend que le composant soit initialisé

        // create helper and sync
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1));
        const boxHelper = new THREE.BoxHelper(mesh, 0xffff00);
        boxHelper.update();

        // simulate update cycle
        component.update(0);

        const halfExtents = component.collider.halfExtents();
        const colliderSize = { x: halfExtents.x, y: halfExtents.y, z: halfExtents.z };
        const boxSize = new THREE.Box3().setFromObject(boxHelper).getSize(new THREE.Vector3());

        expect(boxSize.x).toBeCloseTo(colliderSize.x * 2, 0.01);
        expect(boxSize.y).toBeCloseTo(colliderSize.y * 2, 0.01);
        expect(boxSize.z).toBeCloseTo(colliderSize.z * 2, 0.01);
    });
});

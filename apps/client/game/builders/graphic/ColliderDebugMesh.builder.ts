import { Mesh, MeshBasicMaterial, SphereGeometry, BoxGeometry } from 'three';
import type { ColliderDesc } from '@dimforge/rapier3d-compat';
import { ShapeType, Ball, Cuboid } from '@dimforge/rapier3d-compat';

export class ColliderDebugMeshBuilder {
    static build(colliderDesc: ColliderDesc, color: number = 0x00ff00): Mesh {
        const shapeType = colliderDesc.shape.type;
        let geometry;

        switch (shapeType) {
            case ShapeType.Ball: { // Ball
                const radius = (colliderDesc.shape as Ball).radius;
                geometry = new SphereGeometry(radius, 16, 16);
                break;
            }
            case ShapeType.Cuboid: { // Cuboid
                const halfExtents = (colliderDesc.shape as Cuboid).halfExtents;
                geometry = new BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2);
                break;
            }
            default:
                throw new Error(`ShapeType ${shapeType} non supporté pour debug`);
        }

        const material = new MeshBasicMaterial({ color, wireframe: true });
        return new Mesh(geometry, material);
    }
}

import { _HelperComponent } from './_HelperComponent';
import { _HitboxComponent } from '../hitbox/_HitboxComponent';
import * as THREE from 'three';
import { RapierPhysicsComponent } from '../physics/RapierPhysicsComponent';
import { ShapeType } from '@dimforge/rapier3d-compat';

export class HitboxHelperComponent extends _HelperComponent {
    private material!: THREE.MeshBasicMaterial;

    override start(): void {
        const hitbox = this.entity?.getComponents()?.find(c => c instanceof _HitboxComponent) as _HitboxComponent;
        if (!hitbox) {
            console.warn('[HitboxHelperComponent] No hitbox found.');
            return;
        }

        const desc = hitbox.getColliderDesc();
        const shape = desc.shape;

        const shapeBuilders: Partial<Record<ShapeType, (shape: any) => THREE.BufferGeometry>> = {
            [ShapeType.Ball]: (s) => new THREE.SphereGeometry(s.radius, 16, 16),
            [ShapeType.Cuboid]: (s) => new THREE.BoxGeometry(s.halfExtents.x * 2, s.halfExtents.y * 2, s.halfExtents.z * 2),
            [ShapeType.Capsule]: (s) => new THREE.CapsuleGeometry(s.radius, s.halfHeight * 2, 4),
        };

        const geometryBuilder = shapeBuilders[shape.type];

        if (!geometryBuilder) {
            console.warn('[HitboxHelperComponent] Unsupported shape type:', shape.type);
            return;
        }

        const geometry = geometryBuilder(shape);
        this.material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true });
        this.mesh = new THREE.Mesh(geometry, this.material);

        this.serviceLocator.get('render').scene.add(this.mesh);
    }

    override update(): void {
        super.update();
        const physics = this.entity?.getComponent(RapierPhysicsComponent);
        if (!physics || !this.mesh) return;

        const pos = physics.body.translation();
        const rot = physics.body.rotation();

        this.mesh.position.set(pos.x, pos.y, pos.z);
        this.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    }

    changeColor(color: THREE.Color): void {
        this.material.color.set(color);
    }
}

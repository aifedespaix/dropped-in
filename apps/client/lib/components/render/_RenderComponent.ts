import { _Component } from '../_Component';
import * as THREE from 'three';
import { TransformComponent } from '../transform/TransformComponent';
import { RapierPhysicsComponent } from '../physics/RapierPhysicsComponent';

export abstract class _RenderComponent extends _Component {
    public abstract getObject3D(): THREE.Object3D | undefined;
    protected model!: THREE.Object3D;

    public render(): void {
        const physics = this.entity?.getComponent(RapierPhysicsComponent);
        if (physics) {
            const pos = physics.body.translation();
            const rot = physics.body.rotation();

            this.model.position.set(pos.x, pos.y, pos.z);
            this.model.quaternion.set(rot.x, rot.y, rot.z, rot.w);
            return;
        }

        // fallback si pas de physique
        const transform = this.entity?.getComponent(TransformComponent);
        if (transform) {
            this.model.position.copy(transform.position);
            this.model.rotation.copy(transform.rotation);
            this.model.scale.copy(transform.scale);
        }
    }
}

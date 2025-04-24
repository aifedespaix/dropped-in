import { _Component } from '../_Component';
import * as THREE from 'three';
import { TransformComponent } from '../transform/TransformComponent';
import { RapierPhysicsComponent } from '../physics/RapierPhysicsComponent';

export abstract class _RenderComponent extends _Component {
    public abstract getObject3D(): THREE.Object3D | undefined;
    protected model!: THREE.Object3D;

    public render(): void {
        const physics = this.entity?.tryGetComponent(RapierPhysicsComponent, false);
        if (physics) {
            this._renderPhysics(physics);
            return;
        }

        // Si pas de physique, on utilise la transform
        const transform = this.entity?.tryGetComponent(TransformComponent, false);
        if (transform) {
            this._renderTransform(transform);
            return;
        }

        console.warn('[RenderComponent] No physics or transform found');
    }

    private _renderPhysics(physics: RapierPhysicsComponent): void {
        const pos = physics.body.translation();
        const rot = physics.body.rotation();

        this.model.position.set(pos.x, pos.y, pos.z);
        this.model.quaternion.set(rot.x, rot.y, rot.z, rot.w);
    }

    private _renderTransform(transform: TransformComponent): void {
        this.model.position.copy(transform.position);
        this.model.rotation.copy(transform.rotation);
        this.model.scale.copy(transform.scale);
    }
}

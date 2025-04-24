import { _Component } from '../_Component';
import * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';

export type TransformComponentOptions = {
    position?: THREE.Vector3;
    rotation?: THREE.Euler;
    scale?: THREE.Vector3;
}

/**
 * Physics => TransformComponent => Render
 */
export class TransformComponent extends _Component {
    private _object3D: THREE.Object3D = new THREE.Object3D();

    get object3D(): THREE.Object3D {
        return this._object3D;
    }

    set position(position: RAPIER.Vector) {
        this._object3D.position.set(position.x, position.y, position.z);
    }

    get position(): THREE.Vector3 {
        return this._object3D.position;
    }

    set rotation(rotation: RAPIER.Rotation) {
        this._object3D.rotation.set(rotation.x, rotation.y, rotation.z);
    }

    get rotation(): THREE.Euler {
        return this._object3D.rotation;
    }

    set scale(scale: RAPIER.Vector) {
        this._object3D.scale.set(scale.x, scale.y, scale.z);
    }

    get scale(): THREE.Vector3 {
        return this._object3D.scale;
    }

    set lookAt(target: THREE.Vector3) {
        this._object3D.lookAt(target);
    }

}
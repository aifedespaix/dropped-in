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
    private _position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    private _rotation: THREE.Euler = new THREE.Euler(0, 0, 0);
    private _scale: THREE.Vector3 = new THREE.Vector3(1, 1, 1);

    set position(position: RAPIER.Vector) {
        this._position.set(position.x, position.y, position.z);
    }

    get position(): THREE.Vector3 {
        return this._position;
    }

    set rotation(rotation: RAPIER.Rotation) {
        this._rotation.set(rotation.x, rotation.y, rotation.z);
    }

    get rotation(): THREE.Euler {
        return this._rotation;
    }

    set scale(scale: RAPIER.Vector) {
        this._scale.set(scale.x, scale.y, scale.z);
    }

    get scale(): THREE.Vector3 {
        return this._scale;
    }

}
import { _Component } from '../_Component';
import * as THREE from 'three';

export abstract class _HelperComponent extends _Component {
    protected mesh!: THREE.Object3D;

    override update(): void {
        if (this.mesh) {
            this.mesh.updateMatrixWorld();
        }
    }

    override destroy(): void {
        if (this.mesh && this.mesh.parent) {
            this.mesh.parent.remove(this.mesh);
        }
    }
}

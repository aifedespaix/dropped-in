import * as THREE from 'three';
import { _Component } from './_Component';
import { BoundingBoxComponent } from './BoundingBoxComponent';
import { ThreeRenderService } from '../services/ThreeRenderService';

export class BoundingBoxHelperComponent extends _Component {
    private helper!: THREE.BoxHelper;

    constructor(private renderService: ThreeRenderService) {
        super();
    }

    override start(): void {
        const bbox = this.entity?.tryGetComponent(BoundingBoxComponent);
        if (!bbox) {
            console.warn("[BoundingBoxHelperComponent] No BoundingBoxComponent found");
            return;
        }

        bbox.onReady(() => {
            const object3D = bbox.getObject3D();
            this.helper = new THREE.BoxHelper(object3D, 0xff00ff);
            this.renderService.scene.add(this.helper);
        });
    }

    override update(): void {
        if (this.helper) {
            this.helper.update();
        }
    }

    // === Statics (optionnels) ===

    static getSize(obj: THREE.Object3D): THREE.Vector3 {
        const box = new THREE.Box3().setFromObject(obj);
        return box.getSize(new THREE.Vector3());
    }

    static getHalfSize(obj: THREE.Object3D): THREE.Vector3 {
        return this.getSize(obj).multiplyScalar(0.5);
    }

    static getCenter(obj: THREE.Object3D): THREE.Vector3 {
        const box = new THREE.Box3().setFromObject(obj);
        return box.getCenter(new THREE.Vector3());
    }

    static getBox(obj: THREE.Object3D): THREE.Box3 {
        return new THREE.Box3().setFromObject(obj);
    }
}

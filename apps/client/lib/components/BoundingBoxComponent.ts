import { _Component } from './_Component';
import * as THREE from 'three';
import { PrimitiveRenderComponent } from './render/PrimitiveRenderComponent';
import { GlbRenderComponent } from './render/GlbRenderComponent';

export class BoundingBoxComponent extends _Component {
    private size: THREE.Vector3 = new THREE.Vector3();
    private ready = false;
    private readyCallbacks: (() => void)[] = [];

    override start(): void {
        const primitive = this.entity?.tryGetComponent(PrimitiveRenderComponent);
        const glb = this.entity?.tryGetComponent(GlbRenderComponent);

        if (primitive) {
            this.computeFromMesh(primitive.getObject3D());
        } else if (glb) {
            glb.onReady(() => {
                this.computeFromMesh(glb.model);
            });
        } else {
            console.warn("[BoundingBoxComponent] No render component found");
        }
    }

    private computeFromMesh(obj: THREE.Object3D) {
        const box = new THREE.Box3().setFromObject(obj);
        box.getSize(this.size);
        this.ready = true;
        this.readyCallbacks.forEach(cb => cb());
        this.readyCallbacks = [];
    }

    getSize(): THREE.Vector3 {
        return this.size.clone(); // sécurité : on retourne une copie
    }

    getBox(): THREE.Box3 {
        const primitive = this.entity?.tryGetComponent(PrimitiveRenderComponent);
        const glb = this.entity?.tryGetComponent(GlbRenderComponent);

        if (primitive) {
            return new THREE.Box3().setFromObject(primitive.getObject3D());
        } else if (glb) {
            return new THREE.Box3().setFromObject(glb.model);
        }
        throw new Error("[BoundingBoxComponent] No render component found");
    }

    getObject3D(): THREE.Object3D {
        const primitive = this.entity?.tryGetComponent(PrimitiveRenderComponent);
        const glb = this.entity?.tryGetComponent(GlbRenderComponent);

        if (primitive) {
            return primitive.getObject3D();
        } else if (glb) {
            return glb.model;
        }
        throw new Error("[BoundingBoxComponent] No render component found");
    }

    getHalfSize(): THREE.Vector3 {
        return this.size.clone().multiplyScalar(0.5);
    }

    isReady(): boolean {
        return this.ready;
    }

    onReady(callback: () => void): void {
        if (this.ready) {
            callback();
        } else {
            this.readyCallbacks.push(callback);
        }
    }
}

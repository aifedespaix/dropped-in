import * as THREE from 'three';
import { _RenderComponent } from './_RenderComponent';
import type { ServiceLocator } from '../../services/ServiceLocator';

export type PrimitiveRenderComponentOptions = {
    type: 'box' | 'sphere';
    width: number;
    height: number;
    depth: number;
    color: THREE.Color;
}

export class PrimitiveRenderComponent extends _RenderComponent {

    constructor(serviceLocator: ServiceLocator, params: Partial<PrimitiveRenderComponentOptions>) {
        super(serviceLocator);
        params = {
            type: 'box',
            width: 1,
            height: 1,
            depth: 1,
            color: new THREE.Color(0x44aa88),
            ...params,
        }

        let geometry: THREE.BufferGeometry;
        switch (params.type) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
            case 'box':
            default:
                geometry = new THREE.BoxGeometry(params.width, params.height, params.depth);
                break;
        }

        const material = new THREE.MeshStandardMaterial({ color: params.color });
        this.model = new THREE.Mesh(geometry, material);
        this.serviceLocator.get('render').scene.add(this.model);
    }

    getObject3D(): THREE.Object3D {
        return this.model;
    }

    getSize(): THREE.Vector3 {
        const boundingBox = new THREE.Box3().setFromObject(this.model);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        return size;
    }

}

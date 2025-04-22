import * as THREE from 'three';
import { _RenderComponent } from './_RenderComponent';
import { TransformComponent } from '../transform/TransformComponent';
import { ThreeRenderService } from '../../services/ThreeRenderService';

export type PrimitiveRenderComponentOptions = {
    width?: number;
    height?: number;
    depth?: number;
    color?: THREE.Color;
}

export class PrimitiveRenderComponent extends _RenderComponent {
    private mesh: THREE.Mesh;

    constructor(renderService: ThreeRenderService,
        type: 'box' | 'sphere' = 'box',
        { width = 1, height = 1, depth = 1, color = new THREE.Color(0x44aa88) }: PrimitiveRenderComponentOptions = {}
    ) {
        super(renderService);

        let geometry: THREE.BufferGeometry;
        switch (type) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
            case 'box':
            default:
                geometry = new THREE.BoxGeometry(width, height, depth);
                break;
        }

        const material = new THREE.MeshStandardMaterial({ color });
        this.mesh = new THREE.Mesh(geometry, material);
        renderService.scene.add(this.mesh);
    }

    getObject3D(): THREE.Object3D {
        return this.mesh;
    }

    getSize(): THREE.Vector3 {
        const bbox = new THREE.Box3().setFromObject(this.mesh);
        const size = new THREE.Vector3();
        bbox.getSize(size);
        return size;
    }

    render(): void {
        const transform = this.entity!.getComponent(TransformComponent);
        this.mesh.position.set(transform.position.x, transform.position.y, transform.position.z);
        this.mesh.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
        this.mesh.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
    }
}

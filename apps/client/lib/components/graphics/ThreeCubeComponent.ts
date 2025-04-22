import * as THREE from 'three';
import { IRenderComponent } from "./IRenderComponent";
import { TransformComponent } from '../transform/TransformComponent';
import type { ThreeRenderService } from '~/lib/services/ThreeRenderService';

export class ThreeCubeComponent extends IRenderComponent {
    private mesh: THREE.Mesh | null = null;
    private renderService: ThreeRenderService;

    constructor(renderService: ThreeRenderService) {
        super();
        this.renderService = renderService;
    }

    override init(): void {
        this.initModel();
    }

    initModel(): void {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
        this.mesh = new THREE.Mesh(geometry, material);

        this.renderService.scene.add(this.mesh!);
    }

    render(): void {
        if (!this.mesh) return;

        const transform = this.entity!.getComponent(TransformComponent);
        console.log(transform.rotation.y);

        this.mesh.position.set(
            transform.position.x,
            transform.position.y,
            transform.position.z
        );

        this.mesh.rotation.set(
            transform.rotation.x,
            transform.rotation.y,
            transform.rotation.z
        );

        this.mesh.scale.set(
            transform.scale.x,
            transform.scale.y,
            transform.scale.z
        );
    }
}

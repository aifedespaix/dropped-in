import { IRenderComponent } from './IRenderComponent';
import * as THREE from 'three';
import { ThreeRenderService } from '../../services/ThreeRenderService';
import { TransformComponent } from '../transform/TransformComponent';

export class ThreeRenderComponent extends IRenderComponent {
    private modelPath: string;
    private mesh: THREE.Mesh | null = null;
    private renderService: ThreeRenderService;

    constructor(modelPath: string, renderService: ThreeRenderService) {
        super();
        this.modelPath = modelPath;
        this.renderService = renderService;
    }

    override init(): void {
        this.initModel();
    }

    initModel(): void {
        // Pour l'exemple : cube temporaire
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
        this.mesh = new THREE.Mesh(geometry, material);

        this.renderService.scene.add(this.mesh!);
    }

    render(): void {
        if (!this.mesh) return;

        const transform = this.entity!.getComponent(TransformComponent);
        this.mesh.position.set(
            transform.position.x,
            transform.position.y,
            transform.position.z
        );
    }
}

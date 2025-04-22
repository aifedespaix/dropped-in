import { _RenderComponent } from './_RenderComponent';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import type { ThreeRenderService } from '../../services/ThreeRenderService';
import { TransformComponent } from '../transform/TransformComponent';

export class GlbRenderComponent extends _RenderComponent {
    private loader = new GLTFLoader();
    private path: string;
    public model!: THREE.Group;
    private isLoaded = false;

    private onReadyCallbacks: (() => void)[] = [];

    constructor(renderService: ThreeRenderService, path: string) {
        super(renderService);
        this.path = path;
    }

    override async init(): Promise<void> {
        await this.load();
    }

    getObject3D(): THREE.Object3D | null {
        return this.model;
    }

    private load(): void {
        this.loader.load(this.path, (gltf) => {
            this.model = gltf.scene;
            this.isLoaded = true;

            this.renderService.scene.add(this.model);

            // ✅ Exécuter tous les callbacks à la fin du chargement
            this.onReadyCallbacks.forEach(cb => cb());
            this.onReadyCallbacks = []; // facultatif : on les vide
        });
    }

    /**
     * Permet à d'autres composants d'attendre que le modèle soit prêt
     */
    onReady(callback: () => void): void {
        if (this.isLoaded) {
            callback();
        } else {
            this.onReadyCallbacks.push(callback);
        }
    }

    getSize(): THREE.Vector3 {
        const box = new THREE.Box3().setFromObject(this.model);
        const size = new THREE.Vector3();
        box.getSize(size);
        return size;
    }

    override render(): void {
        const transform = this.entity?.getComponent?.(TransformComponent);
        if (!transform || !this.model) return;

        this.model.position.copy(transform.position);
        this.model.rotation.copy(new THREE.Euler(transform.rotation.x, transform.rotation.y, transform.rotation.z));
        this.model.scale.copy(transform.scale);
    }
}

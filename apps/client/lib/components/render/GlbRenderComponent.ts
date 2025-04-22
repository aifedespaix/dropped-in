import { _RenderComponent } from './_RenderComponent';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import type { ServiceLocator } from '../../services/ServiceLocator';

export class GlbRenderComponent extends _RenderComponent {
    private loader = new GLTFLoader();
    private path: string;
    private isLoaded = false;

    private onReadyCallbacks: (() => void)[] = [];

    constructor(serviceLocator: ServiceLocator, path: string) {
        super(serviceLocator);
        this.path = path;
    }

    override async init(): Promise<void> {
        await this.load();
    }

    getObject3D(): THREE.Object3D {
        console.log(this.model);
        return this.model;
    }

    private async load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.loader.load(
                this.path,
                (gltf) => {
                    this.model = gltf.scene;
                    this.isLoaded = true;

                    this.serviceLocator.get('render').scene.add(this.model);

                    this.onReadyCallbacks.forEach(cb => cb());
                    this.onReadyCallbacks = [];

                    resolve(); // ✅ chargement terminé
                },
                undefined,
                (error) => {
                    console.error("[GlbRenderComponent] Failed to load:", this.path, error);
                    reject(error); // ❌ erreur de chargement
                }
            );
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

}

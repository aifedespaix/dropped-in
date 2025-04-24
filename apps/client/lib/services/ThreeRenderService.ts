import * as THREE from 'three';
import { _Service } from './_Service';

export class ThreeRenderService extends _Service {
    public readonly scene: THREE.Scene;
    public readonly camera: THREE.PerspectiveCamera;
    public readonly renderer: THREE.WebGLRenderer;

    private handleResize = () => this.resize();

    constructor(private container: HTMLElement) {
        super()
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 1.8, 4);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        container.appendChild(this.renderer.domElement);

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        this.scene.add(light);

        window.addEventListener('resize', this.handleResize);
    }

    resize(): void {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.render()
    }

    render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    dispose(): void {
        window.removeEventListener('resize', this.handleResize);
    }
}

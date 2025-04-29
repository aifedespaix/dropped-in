import { PerspectiveCamera } from "three";

export class GameCamera extends PerspectiveCamera {
    readonly #container: HTMLElement;

    constructor(container: HTMLElement) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        const aspect = width / height;

        super(
            70,     // FOV vertical (Field Of View en degrés)
            aspect, // Aspect ratio (largeur / hauteur)
            0.1,    // Near plane (plus proche visible)
            2000    // Far plane (plus lointain visible)
        );

        this.#container = container;

        this.position.set(0, 1.8, -3);
        this.lookAt(0, 0, 0);
    }

    resize(): void {
        const width = this.#container.clientWidth;
        const height = this.#container.clientHeight;

        this.aspect = width / height;
        this.updateProjectionMatrix();
    }

    get domElement(): HTMLElement {
        return this.#container;
    }
}

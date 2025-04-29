import { AmbientLight, DirectionalLight, Scene } from "three";

export class MainScene extends Scene {
    constructor() {
        super();
        this.#createLights();
    }


    #createLights(): void {
        const ambientLight = new AmbientLight(0xffffff, 0.4);
        this.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        this.add(directionalLight);
    }

}
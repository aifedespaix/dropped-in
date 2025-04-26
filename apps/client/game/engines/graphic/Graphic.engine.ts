import { DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer, Mesh } from "three";
import { _Engine } from "../_Engine";
import { MeshComponent } from "~/game/components/graphic/Mesh.component";
import type { _Entity } from "~/game/entities/_Entity";
import { GraphicBuilderRegistry } from "~/game/registries/GraphicBuilder.registry";
import { ComponentSource } from "~/game/components/_Component";
import { CubeComponent } from "~/game/components/declarative/Cube.component";
import type { ServiceLocator } from "~/game/core/ServiceLocator";
import { InputComponent } from "~/game/components/system/Input.component";
import { PlayerFlagComponent } from "~/game/components/declarative/PlayerFlag.component";

export class GraphicEngine extends _Engine {
    readonly #scene: Scene;
    readonly #camera: PerspectiveCamera;
    readonly #renderer: WebGLRenderer;
    readonly #container: HTMLElement;

    readonly #builderRegistry = new GraphicBuilderRegistry();

    private handleResize = () => this.resize();

    constructor(serviceLocator: ServiceLocator, container: HTMLElement) {
        super(serviceLocator);
        this.#container = container;

        this.#scene = this.#createScene();
        this.#camera = this.#createCamera();
        this.#renderer = this.#createRenderer();
    }

    protected entityFilter(_entity: _Entity): boolean {
        return _entity.hasComponent(CubeComponent);
    }

    protected onEntityAdded(entity: _Entity): void {
        if (entity.hasComponent(CubeComponent)) {
            const cubeComponent = entity.getComponent(CubeComponent);
            const mesh = this.#builderRegistry.get("Mesh").build(cubeComponent) as Mesh;
            entity.addComponentSafe(new MeshComponent(mesh), ComponentSource.Engine);
        }

        if (entity.hasComponent(PlayerFlagComponent)) {
            entity.getComponent(MeshComponent).mesh.add(this.#camera);
            this.#camera.position.set(0, 2, -2);
            this.#camera.lookAt(0, 1.8, 0);
        }

        this.#scene.add(entity.getComponent(MeshComponent).mesh);
    }

    override start(): void {
        super.start();
        window.addEventListener('resize', this.handleResize);
        this.#container.appendChild(this.#renderer.domElement);
    }

    override update(delta: number): void {
        super.update(delta);
        this.#renderer.render(this.#scene, this.#camera);
    }

    protected updateEntity(entity: _Entity, delta: number): void {
        const mesh = entity.getComponent(MeshComponent).mesh;
        const transform = entity.transform;

        mesh.position.copy(transform.position);
        mesh.quaternion.copy(transform.rotation);
        mesh.scale.copy(transform.scale);
    }

    resize(): void {
        const width = this.#container.clientWidth;
        const height = this.#container.clientHeight;

        this.#camera.aspect = width / height;
        this.#camera.updateProjectionMatrix();
        this.#renderer.setSize(width, height);
    }

    dispose(): void {
        window.removeEventListener('resize', this.handleResize);
    }

    #createScene(): Scene {
        const scene = new Scene();

        const light = this.#createLight();
        scene.add(light);

        return scene;
    }

    #createLight(): DirectionalLight {
        const light = new DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 7.5);
        return light;
    }

    #createCamera(): PerspectiveCamera {
        const width = this.#container.clientWidth;
        const height = this.#container.clientHeight;

        const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, -10);
        camera.lookAt(0, 0, 0);

        return camera;
    }

    #createRenderer(): WebGLRenderer {
        const renderer = new WebGLRenderer({ antialias: true });
        renderer.setSize(this.#container.clientWidth, this.#container.clientHeight);
        return renderer;
    }
}



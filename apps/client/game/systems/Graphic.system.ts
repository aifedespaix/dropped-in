import { Scene, WebGLRenderer, Mesh } from "three";
import { _System } from "./_System";
import { MeshComponent } from "~/game/components/graphic/Mesh.component";
import { CubeComponent } from "~/game/components/declarative/Cube.component";
import { GraphicBuilderRegistry } from "~/game/builders/GraphicBuilder.registry";
import type { Entity } from "~/game/entities/Entity";
import type { ServiceLocator } from "~/game/core/ServiceLocator";
import { ComponentSource } from "../components/_Component";
import { GameCamera } from "../cameras/Game.camera";
import { CameraControlSystem } from "./CameraControl.system";
import { MainScene } from "../scenes/Main.scene";
import { ColliderDebugMeshBuilder } from "../builders/graphic/ColliderDebugMesh.builder";
import { ColliderDebugComponent } from "../components/declarative/ColliderDebug.component";
import { PhysicsInstanceComponent } from "../components/physic/PhysicInstance.component";
import { SphereComponent } from "../components/declarative/Sphere.component";

export class GraphicsSystem extends _System {
    readonly #scene: Scene;
    readonly #camera: GameCamera;
    readonly #renderer: WebGLRenderer;
    readonly #container: HTMLElement;

    readonly #builderRegistry = new GraphicBuilderRegistry();

    private handleResize = () => this.resize();

    constructor(serviceLocator: ServiceLocator, container: HTMLElement) {
        super(serviceLocator);
        this.#container = container;

        this.#scene = new MainScene();
        this.#camera = new GameCamera(this.#container);
        this.#renderer = this.#createRenderer();

        const cameraControlSystem = new CameraControlSystem(serviceLocator, this.#camera);
        this.subSystems.add(cameraControlSystem);
    }

    override start(): void {
        window.addEventListener('resize', this.handleResize);
        this.#container.appendChild(this.#renderer.domElement);
        this.resize();
    }

    override dispose(): void {
        window.removeEventListener('resize', this.handleResize);
    }

    override update(delta: number): void {
        super.update(delta);
        this.#renderer.render(this.#scene, this.#camera);
    }

    protected override entityFilter(entity: Entity): boolean {
        return entity.hasComponent(CubeComponent) || entity.hasComponent(SphereComponent);
    }

    protected override onEntityAdded(entity: Entity): void {
        if (entity.hasComponent(CubeComponent)) {
            const cubeComponent = entity.getComponent(CubeComponent);
            const mesh = this.#builderRegistry.get("Cube").build(cubeComponent) as Mesh;
            entity.addComponentSafe(new MeshComponent(mesh), ComponentSource.System);
        }
        if (entity.hasComponent(SphereComponent)) {
            const sphereComponent = entity.getComponent(SphereComponent);
            const mesh = this.#builderRegistry.get("Sphere").build(sphereComponent) as Mesh;
            entity.addComponentSafe(new MeshComponent(mesh), ComponentSource.System);
        }

        const meshComponent = entity.getComponent(MeshComponent);
        this.#scene.add(meshComponent.mesh);

        if (entity.hasComponent(ColliderDebugComponent) && entity.hasComponent(PhysicsInstanceComponent)) {
            const colliderDebug = entity.getComponent(ColliderDebugComponent);
            const physics = entity.getComponent(PhysicsInstanceComponent);
            const debugMesh = ColliderDebugMeshBuilder.build(physics.colliderDesc, colliderDebug.color);

            meshComponent.mesh.add(debugMesh);
        }
    }

    protected override updateEntity(entity: Entity, delta: number): void {
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

    #createRenderer(): WebGLRenderer {
        const renderer = new WebGLRenderer({ antialias: true });
        renderer.setSize(this.#container.clientWidth, this.#container.clientHeight);
        return renderer;
    }
}

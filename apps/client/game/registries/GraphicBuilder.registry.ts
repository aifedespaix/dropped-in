import type { Object3D } from "three";
import { _BuilderRegistry } from "./_BuilderRegistry";
import { MeshBuilder } from "../builders/graphic/Mesh.builder";

type RegistryName = "Mesh";

export class GraphicBuilderRegistry extends _BuilderRegistry<RegistryName, Object3D> {
    registerDefaultBuilders(): void {
        this.register("Mesh", new MeshBuilder());
    }
}

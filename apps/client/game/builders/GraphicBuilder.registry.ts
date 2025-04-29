import type { Mesh } from "three";
import { _BuilderRegistry } from "./_BuilderRegistry";
import { MeshBuilder } from "./graphic/Mesh.builder";
import { SphereMeshBuilder } from "./graphic/SphereMesh.builder";


export type GraphicBuilderTypeMap = {
    Cube: Mesh;
    Sphere: Mesh;
    // Plus tard :
    // GlbModel: Object3D;
    // PointsCloud: Points;
    // etc.
};

export class GraphicBuilderRegistry extends _BuilderRegistry<GraphicBuilderTypeMap> {
    protected registerDefaultBuilders(): void {
        this.register("Cube", new MeshBuilder());
        this.register("Sphere", new SphereMeshBuilder());
    }
}

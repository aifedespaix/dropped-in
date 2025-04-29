import type { _GraphicBuilder } from "../builders/graphic/_Graphic.builder";
import { CubeMeshBuilder } from "../builders/graphic/CubeMesh.builder";
import type { _Component } from "../components/_Component";
import { CubeComponent } from "../components/declarative/Cube.component";
import { SphereComponent } from "../components/declarative/Sphere.component";
import { SphereMeshBuilder } from "../builders/graphic/SphereMesh.builder";

export class GraphicBuilderFactory {
    static createBuilder(component: _Component): _GraphicBuilder {
        if (component instanceof CubeComponent) {
            return new CubeMeshBuilder();
        }
        if (component instanceof SphereComponent) {
            return new SphereMeshBuilder();
        }
        // Ajoute ici d'autres types
        throw new Error("Unknown component type for GraphicBuilder.");
    }
}

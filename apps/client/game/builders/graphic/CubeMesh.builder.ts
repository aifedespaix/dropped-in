import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import { _GraphicBuilder } from "./_Graphic.builder";
import { CubeComponent } from "../../components/declarative/Cube.component";
import { MaterialFactory } from "~/game/factories/Material.factory";

export class CubeMeshBuilder extends _GraphicBuilder {
    build(component: CubeComponent): Mesh {
        const geometry = new BoxGeometry(component.size[0], component.size[1], component.size[2]);

        const material = MaterialFactory.create(
            component.materialType,
            component.color,
            {
                wireframe: component.wireframe,
                ...component.materialOptions
            }
        );

        const mesh = new Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        return mesh;
    }
}

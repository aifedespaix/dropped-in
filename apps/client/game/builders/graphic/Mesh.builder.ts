import { MeshBasicMaterial, Mesh, BoxGeometry } from "three";
import { _GraphicBuilder } from "./_Graphic.builder";
import { CubeComponent } from "../../components/declarative/Cube.component";

export class MeshBuilder extends _GraphicBuilder {
    build(component: CubeComponent): Mesh {
        const geometry = new BoxGeometry(component.size[0], component.size[1], component.size[2]);
        const material = new MeshBasicMaterial({ color: component.color, wireframe: component.wireframe });
        const mesh = new Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        return mesh;
    }
}

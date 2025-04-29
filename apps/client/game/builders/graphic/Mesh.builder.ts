import { Mesh, BoxGeometry, MeshStandardMaterial, MeshBasicMaterial, MeshPhysicalMaterial, MeshPhongMaterial } from "three";
import { _GraphicBuilder } from "./_Graphic.builder";
import { CubeComponent } from "../../components/declarative/Cube.component";

export class MeshBuilder extends _GraphicBuilder {
    build(component: CubeComponent): Mesh {
        const geometry = new BoxGeometry(component.size[0], component.size[1], component.size[2]);
        let material;

        switch (component.materialType) {
            case 'basic':
                material = new MeshBasicMaterial({ color: component.color, wireframe: component.wireframe, ...component.materialOptions });
                break;
            case 'standard':
                material = new MeshStandardMaterial({ color: component.color, wireframe: component.wireframe, ...component.materialOptions });
                break;
            case 'physical':
                material = new MeshPhysicalMaterial({ color: component.color, wireframe: component.wireframe, ...component.materialOptions });
                break;
            case 'phong':
                material = new MeshPhongMaterial({ color: component.color, wireframe: component.wireframe, ...component.materialOptions });
                break;
        }


        const mesh = new Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        return mesh;
    }
}

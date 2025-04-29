import { SphereGeometry, Mesh } from "three";
import { _GraphicBuilder } from "./_Graphic.builder";
import { MaterialFactory } from "~/game/factories/Material.factory";
import { SphereComponent } from "../../components/declarative/Sphere.component";

export class SphereMeshBuilder extends _GraphicBuilder {
    build(component: SphereComponent): Mesh {
        const geometry = new SphereGeometry(component.radius, 32, 32);

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

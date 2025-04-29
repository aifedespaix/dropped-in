import type { Object3D } from "three";
import { _GraphicBuilder } from "./_Graphic.builder";
import type { GlbModelComponent } from "~/game/components/declarative/GlbModel.component";

export class GlbModelBuilder extends _GraphicBuilder {
    async build(component: GlbModelComponent): Promise<Object3D> {
        const loader = new GLTFLoader();
        const gltf = await loader.loadAsync(component.modelPath);

        const model = gltf.scene;
        model.scale.set(component.scale[0], component.scale[1], component.scale[2]);
        model.position.set(0, 0, 0);

        return model;
    }
}

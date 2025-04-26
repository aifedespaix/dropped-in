import { Mesh } from "three";
import { ComponentType, _Component } from "../_Component";

export class MeshComponent extends _Component {
    readonly #mesh: Mesh;

    constructor(mesh: Mesh) {
        super(ComponentType.Runtime);
        this.#mesh = mesh;
    }

    get mesh(): Mesh {
        return this.#mesh;
    }
}
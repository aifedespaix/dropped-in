// components/TransformComponent.ts
import { _Component } from '../_Component';

export class TransformComponent extends _Component {
    position = { x: 0, y: 0, z: 0 };
    rotation = { x: 0, y: 0, z: 0 };
    scale = { x: 1, y: 1, z: 1 };

    isGrounded: boolean = true;

    translate(dx: number, dy: number, dz: number): void {
        this.position.x += dx;
        this.position.y += dy;
        this.position.z += dz;
    }

    rotate(drx: number, dry: number, drz: number): void {
        this.rotation.x += drx;
        this.rotation.y += dry;
        this.rotation.z += drz;
    }
}

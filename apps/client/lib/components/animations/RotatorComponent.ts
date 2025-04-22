import { _Animation } from './_Animation';
import { TransformComponent } from '../transform/TransformComponent';

export class RotatorComponent extends _Animation {
    private speedX: number;
    private speedY: number;
    private speedZ: number;

    constructor(speedX = 0, speedY = 1, speedZ = 0) {
        super();
        this.speedX = speedX;
        this.speedY = speedY;
        this.speedZ = speedZ;
    }

    update(dt: number): void {
        const transform = this.entity!.getComponent(TransformComponent);
        transform.rotation.x += this.speedX * dt;
        transform.rotation.y += this.speedY * dt;
        transform.rotation.z += this.speedZ * dt;
    }
}

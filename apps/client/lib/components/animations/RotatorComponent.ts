import { _Animation } from './_Animation';
import { TransformComponent } from '../transform/TransformComponent';
import type { ServiceLocator } from '../../services/ServiceLocator';

type RotatorComponentOptions = {
    speedX?: number;
    speedY?: number;
    speedZ?: number;
}

export class RotatorComponent extends _Animation {
    protected speedX: number;
    protected speedY: number;
    protected speedZ: number;

    constructor(serviceLocator: ServiceLocator, options?: RotatorComponentOptions) {
        super(serviceLocator);
        this.speedX = options?.speedX ?? 0;
        this.speedY = options?.speedY ?? 1;
        this.speedZ = options?.speedZ ?? 0;
    }

    update(dt: number): void {
        const transform = this.entity!.getComponent(TransformComponent);
        transform.rotation.x += this.speedX * dt;
        transform.rotation.y += this.speedY * dt;
        transform.rotation.z += this.speedZ * dt;
    }
}

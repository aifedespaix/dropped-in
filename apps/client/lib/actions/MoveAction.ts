import { Vector3 } from 'three';
import { TransformComponent } from '../components/transform/TransformComponent';
import type { _Entity } from '../entities/_Entity';
import { _Action } from './_Action';
import type { ActionChannel } from '../types/ActionChannel';

export class MoveAction extends _Action {
    private direction: Vector3;
    private speed = 20;

    constructor(direction: Vector3) {
        super();
        this.direction = direction.clone();
    }

    override end(): void {
        console.log("MoveAction ended");
    }

    setDirection(direction: Vector3): void {
        this.direction.copy(direction);
    }

    start(entity: _Entity): void {
        this.entity = entity;
        this.isStarted = true;
    }

    update(dt: number): void {
        const transform = this.entity!.getComponent(TransformComponent);
        transform.position.x += this.direction.x * this.speed * dt;
        transform.position.z += this.direction.z * this.speed * dt;
    }

    isComplete(): boolean {
        return false; // mouvement infini tant qu’il est actif
    }

    cancel(): void {
        this.end?.(); // méthode optionnelle si tu veux clean
    }

    override isBlocking(): boolean {
        return false;
    }

    override getChannel(): ActionChannel {
        return "movement";
    }
}

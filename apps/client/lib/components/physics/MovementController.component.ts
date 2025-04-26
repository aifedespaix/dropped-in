import { Vector3, Quaternion } from 'three';
import { _Component } from '../_Component';
import { ServiceLocator } from '../../services/ServiceLocator';
import { RapierPhysicsComponent } from '../physics/RapierPhysicsComponent';
import { InputComponent } from '../InputComponent';
import * as RAPIER from '@dimforge/rapier3d-compat';

const GRAVITY = 9.81;

export class MovementControllerComponent extends _Component {
    private controller!: RAPIER.KinematicCharacterController;
    private verticalSpeed = 0;
    private jumpForce = 6;
    private speed = 5;
    private isJumping = false;

    private inputComponent!: InputComponent;
    private physicsComponent!: RapierPhysicsComponent;

    private lastPlatformPos: RAPIER.Vector3 | null = null;

    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    override async init(): Promise<void> {
        const world = this.serviceLocator.get('physics').getWorld();

        this.controller = world.createCharacterController(0.01);
        this.controller.setCharacterMass(80);
        this.controller.setSlideEnabled(true);
        this.controller.enableSnapToGround(0.6);
        this.controller.enableAutostep(0.5, 0.2, true);
        this.controller.setMaxSlopeClimbAngle(Math.PI / 4);
        this.controller.setMinSlopeSlideAngle(Math.PI / 6);
    }

    override start(): void {
        this.inputComponent = this.entity?.getComponent(InputComponent);
        this.physicsComponent = this.entity?.getComponent(RapierPhysicsComponent);
    }

    override update(dt: number): void {
        const movement = this.calculateMovement(dt);
        this.controller.computeColliderMovement(this.physicsComponent.collider, movement);

        if (this.grounded) {
            this.verticalSpeed = 0;
            this.isJumping = false;
        }

        // 3. Récupère le vecteur de déplacement calculé
        const finalMove = this.controller.computedMovement();

        // 4. Applique le déplacement à la main
        const currentPos = this.physicsComponent.body.translation();
        this.physicsComponent.body.setTranslation({
            x: currentPos.x + finalMove.x,
            y: currentPos.y + finalMove.y,
            z: currentPos.z + finalMove.z,
        }, true); // true = wake up the body
    }

    private calculateMovement(dt: number): Vector3 {
        const inputDir = new Vector3(this.inputComponent.getDirection().x, 0, this.inputComponent.getDirection().z);
        const rotation = new Quaternion().copy(this.physicsComponent.body.rotation());
        inputDir.applyQuaternion(rotation).normalize().multiplyScalar(this.speed);
        this.verticalSpeed -= GRAVITY * dt;
        const movement = inputDir.setY(this.verticalSpeed).multiplyScalar(dt);
        return movement;
    }

    public triggerJump(): void {
        if (!this.isJumping && this.controller.computedGrounded()) {
            this.verticalSpeed = this.jumpForce;
            this.isJumping = true;
        }
    }

    get characterController(): RAPIER.KinematicCharacterController {
        return this.controller;
    }

    get grounded(): boolean {
        return this.controller.computedGrounded();
    }
}

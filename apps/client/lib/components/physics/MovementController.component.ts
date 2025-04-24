import { Euler, Quaternion, Vector3 } from 'three';
import { RapierPhysicsComponent } from '../physics/RapierPhysicsComponent';
import { InputComponent } from '../InputComponent';
import { ServiceLocator } from '../../services/ServiceLocator';
import { _Component } from '../_Component';
import * as RAPIER from '@dimforge/rapier3d-compat';

const GRAVITY = 9.81;
export class MovementControllerComponent extends _Component {
    private characterController!: RAPIER.KinematicCharacterController;
    private speedInMetersBySecond = 5; // m/s
    private jumpForce = 6;
    private verticalSpeed = 0;
    private isJumping = false;


    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    override init(): Promise<void> {
        const world = this.serviceLocator.get('physics').getWorld();
        this.characterController = world.createCharacterController(0.01);

        this.characterController.setMaxSlopeClimbAngle(45 * Math.PI / 180);
        this.characterController.setMinSlopeSlideAngle(30 * Math.PI / 180);
        this.characterController.enableAutostep(0.5, 0.2, true);
        this.characterController.enableSnapToGround(0.5);
        this.characterController.setCharacterMass(80);
        this.characterController.setApplyImpulsesToDynamicBodies(true);
        this.characterController.setSlideEnabled(true);
        return Promise.resolve();
    }

    override update(dt: number): void {
        const physics = this.entity?.getComponent(RapierPhysicsComponent);
        if (!physics?.body) return;

        const desiredMovement = this.getRelativeMovementInput(dt, physics);
        this.applyCharacterMovement(desiredMovement, physics);
    }

    private getRelativeMovementInput(dt: number, physics: RapierPhysicsComponent): Vector3 {
        const input = this.entity?.getComponent(InputComponent);
        const inputDir = input?.getDirection(); // { x, z }
        const inputDirection = new Vector3(inputDir.x, 0, inputDir.z);

        // Rotation du personnage
        const rotation = physics.body.rotation();
        const quat = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
        inputDirection.applyQuaternion(quat);

        // Appliquer la vitesse
        const moveVec = inputDirection.normalize().multiplyScalar(this.speedInMetersBySecond);

        // Gravité
        this.verticalSpeed -= GRAVITY * dt;
        moveVec.y = this.verticalSpeed;

        // Si au sol, reset vertical
        if (this.characterController.computedGrounded()) {
            this.verticalSpeed = 0;
            this.isJumping = false;
        }

        return moveVec.multiplyScalar(dt); // movement à passer au CharacterController
    }

    private applyCharacterMovement(movement: Vector3, physics: RapierPhysicsComponent): void {
        const world = this.serviceLocator.get('physics').getWorld();

        // Appliquer le mouvement souhaité
        this.characterController.computeColliderMovement(physics.collider, movement);

        // Vérifier si le personnage est au sol
        if (this.characterController.computedGrounded()) {
            const numCollisions = this.characterController.numComputedCollisions();

            for (let i = 0; i < numCollisions; i++) {
                const collision = this.characterController.computedCollision(i);

                // Vérifie que la collision est valide et qu'elle vient du bas
                if (!collision) continue;
                const normal = collision.normal1;
                if (normal.y > 0.5 && collision.collider) {
                    const parentHandle = collision.collider.parent();
                    if (parentHandle !== null) {
                        const platformBody = collision.collider.parent(); // ← RigidBody | null

                        if (platformBody) {
                            const linVel = platformBody.linvel();
                            movement.x += linVel.x;
                            movement.y += linVel.y;
                            movement.z += linVel.z;
                        }

                        break; // une seule plateforme suffit
                    }
                }
            }

            // Appliquer le mouvement corrigé
            const correctedMovement = this.characterController.computedMovement();
            const currentPosition = physics.body.translation();

            physics.body.setNextKinematicTranslation({
                x: currentPosition.x + correctedMovement.x,
                y: currentPosition.y + correctedMovement.y,
                z: currentPosition.z + correctedMovement.z,
            });
        }


        // Appliquer le mouvement corrigé
        const correctedMovement = this.characterController.computedMovement();
        const currentPosition = physics.body.translation();

        physics.body.setNextKinematicTranslation({
            x: currentPosition.x + correctedMovement.x,
            y: currentPosition.y + correctedMovement.y,
            z: currentPosition.z + correctedMovement.z,
        });
    }



    public triggerJump(): void {
        if (!this.isJumping) {
            this.verticalSpeed = this.jumpForce;
            this.isJumping = true;
        }
    }

}

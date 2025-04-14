import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { PhysicsObject } from './PhysicsObject';
import { PhysicsEngine } from './PhysicsEngine';

export class CharacterPhysics extends PhysicsObject {
    private speed = 5.0;
    private jumpForce = 5.0;
    private isGrounded = false;
    private readonly GROUND_CHECK_DISTANCE = 0.1;
    private readonly GROUND_CHECK_OFFSET = 0.5;
    private readonly KILL_ZONE_Y = -10;
    private lastValidPosition: THREE.Vector3;

    constructor(physicsEngine: PhysicsEngine, mesh: THREE.Object3D) {
        super(physicsEngine, mesh, {
            type: 'dynamic',
            mass: 1,
            friction: 0.3,
            restitution: 0.0,
            colliderType: 'capsule',
            colliderSize: new THREE.Vector3(0.5, 1.75, 0.5),
            lockRotation: true
        });
        this.lastValidPosition = new THREE.Vector3(0, 1.75, 0);

        // S'assurer que le corps rigide est bien configuré
        const rigidBody = this.getRigidBody();
        if (rigidBody) {
            console.log('CharacterPhysics - Configuring rigid body');
            rigidBody.setEnabled(true);
            rigidBody.setLinearDamping(0.1);  // Réduire légèrement la friction de l'air
            rigidBody.setAngularDamping(0.0); // Pas de rotation
            rigidBody.setGravityScale(1.0, true); // S'assurer que la gravité est active
            rigidBody.wakeUp(); // Forcer le réveil du corps
            console.log('CharacterPhysics - Rigid body configured:', {
                enabled: rigidBody.isEnabled(),
                sleeping: rigidBody.isSleeping(),
                mass: rigidBody.mass(),
                gravityScale: rigidBody.gravityScale()
            });
        }
    }

    public canMove(): boolean {
        return this.getRigidBody() !== null;
    }

    public override move(direction: THREE.Vector3, horizontalRotation: number): void {
        const rigidBody = this.getRigidBody();
        if (!direction || !rigidBody) {
            console.warn('CharacterPhysics - Invalid movement:', {
                hasDirection: !!direction,
                hasRigidBody: !!rigidBody
            });
            return;
        }

        // Réveiller le corps si nécessaire
        if (rigidBody.isSleeping()) {
            console.log('CharacterPhysics - Waking up rigid body');
            rigidBody.wakeUp();
        }

        if (direction.y > 0) {
            const isGrounded = this.checkGrounded();
            console.log('CharacterPhysics - Jump attempt:', {
                isGrounded,
                direction: direction.toArray()
            });
        }

        const moveDirection = direction.clone();
        moveDirection.y = 0;

        if (isNaN(moveDirection.x) || isNaN(moveDirection.z)) {
            console.warn('CharacterPhysics - Invalid movement direction:', moveDirection.toArray());
            return;
        }

        console.log('CharacterPhysics - Processing movement:', {
            originalDirection: direction.toArray(),
            moveDirection: moveDirection.toArray(),
            speed: this.speed,
            horizontalRotation
        });

        // Appliquer la vélocité en conservant la vélocité verticale actuelle
        const currentVel = rigidBody.linvel();
        const rapierDirection = new RAPIER.Vector3(
            moveDirection.x * this.speed,
            currentVel.y,  // Conserver la vélocité verticale
            moveDirection.z * this.speed
        );

        console.log('CharacterPhysics - Applying velocity:', {
            x: rapierDirection.x,
            y: rapierDirection.y,
            z: rapierDirection.z
        });

        rigidBody.setLinvel(rapierDirection, true);
        rigidBody.wakeUp(); // S'assurer que le corps reste actif

        const position = rigidBody.translation();
        console.log('CharacterPhysics - New position:', {
            x: position.x,
            y: position.y,
            z: position.z
        });

        if (position.y < this.KILL_ZONE_Y) {
            console.log('CharacterPhysics - Character below kill zone, respawning');
            this.respawn();
        }
    }

    private checkGrounded(): boolean {
        const rigidBody = this.getRigidBody();
        const position = rigidBody.translation();

        const rayOrigin = new RAPIER.Vector3(
            position.x,
            position.y + this.GROUND_CHECK_OFFSET,
            position.z
        );
        const rayDirection = new RAPIER.Vector3(0, -1, 0);
        const ray = new RAPIER.Ray(rayOrigin, rayDirection);

        const hit = this.getPhysicsEngine()
            .getWorld()
            .castRay(ray, this.GROUND_CHECK_DISTANCE * 0.5, true);

        this.isGrounded = hit !== null;
        return this.isGrounded;
    }

    private respawn(): void {
        const rigidBody = this.getRigidBody();
        rigidBody.setTranslation(
            new RAPIER.Vector3(
                this.lastValidPosition.x,
                this.lastValidPosition.y,
                this.lastValidPosition.z
            ),
            true
        );
        rigidBody.setLinvel(new RAPIER.Vector3(0, 0, 0), true);
        rigidBody.setAngvel(new RAPIER.Vector3(0, 0, 0), true);
    }

    public updateLastValidPosition(): void {
        const position = this.getRigidBody().translation();
        this.lastValidPosition.set(position.x, position.y, position.z);
    }

    public override getPosition(): THREE.Vector3 {
        const position = this.getRigidBody().translation();
        return new THREE.Vector3(position.x, position.y, position.z);
    }
} 
import * as RAPIER from '@dimforge/rapier3d-compat';
import { _System } from './_System';
import { RapierPhysicsComponent, type BodyUserData } from '../components/physics/RapierPhysicsComponent';
import { MovementControllerComponent } from '../components/physics/MovementController.component';
import { ServiceLocator } from '../services/ServiceLocator';
import type { _Entity } from '../entities/_Entity';

export class PlatformAttachSystem extends _System {
    private joint: RAPIER.PrismaticImpulseJoint | null = null;
    private attachedPlatformHandle: RAPIER.RigidBodyHandle | null = null;

    constructor(private serviceLocator: ServiceLocator, private sourceEntity: _Entity, targetEntities: _Entity[]) {
        super();
    }

    update(dt: number): void {
        const physics = this.sourceEntity.getComponent(RapierPhysicsComponent);
        const movementController = this.sourceEntity.getComponent(MovementControllerComponent);
        const characterController = movementController.characterController;

        const world = this.serviceLocator.get('physics').getWorld();

        // 2. Check collisions du bas
        let foundPlatform = false;
        for (let i = 0; i < characterController.numComputedCollisions(); i++) {
            const collision = characterController.computedCollision(i);
            if (!collision) continue;

            const normal = collision.normal1;
            const platformBody = collision.collider?.parent();

            if (!platformBody) continue;

            // Check si c’est bien une collision par le bas avec une plateforme
            if (normal.y > 0.5 && this.isPlatform(platformBody)) {
                foundPlatform = true;

                if (!this.joint || platformBody.handle !== this.attachedPlatformHandle) {
                    // Supprimer ancien joint si autre plateforme
                    if (this.joint) world.impulseJoints.remove(this.joint.handle, true);

                    console.log('create joint');
                    // Créer un prismatic joint temporaire
                    const axis = { x: 0, y: 1, z: 0 }; // TODO: détecter dynamiquement ?
                    const jointData = RAPIER.JointData.prismatic({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, axis);
                    jointData.limitsEnabled = true;
                    jointData.limits = [-0.2, 0.2];
                    console.log('pos A:', physics.body.translation());
                    console.log('pos B:', platformBody.translation());

                    this.joint = world.createImpulseJoint(jointData, physics.body, platformBody, true) as RAPIER.PrismaticImpulseJoint;
                    this.attachedPlatformHandle = platformBody.handle;
                    console.log('attach platform');
                }

                break;
            }
        }

        // 3. Si on n'est plus sur une plateforme → détacher
        if (!foundPlatform && this.joint) {
            world.impulseJoints.remove(this.joint.handle, true);
            this.joint = null;
            this.attachedPlatformHandle = null;
        }
    }

    private isPlatform(body: RAPIER.RigidBody): boolean {
        return !!(body.userData as BodyUserData)?.isPlatform;
    }

}

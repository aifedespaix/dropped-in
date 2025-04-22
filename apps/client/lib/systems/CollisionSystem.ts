// components/_System.ts
import type { _Entity } from '../entities/_Entity';
import { _System } from './_System';
import { RapierPhysicsComponent } from '../components/physics/RapierPhysicsComponent';
import { HitboxHelperComponent } from '../components/helpers/HitboxHelperComponent';
import * as THREE from 'three';
import type { ServiceLocator } from '../services/ServiceLocator';
import { CollisionStateComponent } from '../components/CollisionStateComponent';

export class CollisionSystem extends _System {
    private sourceEntity: _Entity;
    private collidingPairs = new Set<string>();
    private _serviceLocator: ServiceLocator;

    private collisionColor = 0xff0000;
    private noCollisionColor = 0x00ff00;

    constructor(serviceLocator: ServiceLocator, sourceEntity: _Entity) {
        super();
        this.sourceEntity = sourceEntity;
        this._serviceLocator = serviceLocator;
    }

    update(dt: number, entities: _Entity[]): void {
        const physicsEntities = entities.filter(e => e.hasComponent(RapierPhysicsComponent));
        const currentFramePairs = new Set<string>();
        let sourceHasCollision = false;

        for (const targetEntity of physicsEntities) {
            if (targetEntity === this.sourceEntity) continue;
            const key = this.getPairKey(targetEntity, this.sourceEntity);

            const inContact = this.checkContact(targetEntity, this.sourceEntity);
            if (inContact) {
                currentFramePairs.add(key);
                sourceHasCollision = true;
                if (!this.collidingPairs.has(key)) {
                    this.onCollisionEnter(targetEntity);
                }
            } else {
                if (this.collidingPairs.has(key)) {
                    this.onCollisionExit(targetEntity);
                }
            }
        }

        this.collidingPairs = currentFramePairs;
        this.setHitboxColor(this.sourceEntity, sourceHasCollision ? this.collisionColor : this.noCollisionColor);
    }

    private checkContact(entityA: _Entity, entityB: _Entity): boolean {
        const world = this._serviceLocator.get('physics').getWorld();
        const colliderA = entityA.getComponent(RapierPhysicsComponent).collider;
        const colliderB = entityB.getComponent(RapierPhysicsComponent).collider;
        let inContact = false;

        world.contactPair(colliderA, colliderB, (manifold) => {
            if (manifold.numContacts() > 0) {
                inContact = true;
            }
        });

        return inContact;
    }

    private onCollisionEnter(targetEntity: _Entity): void {
        const collisionStateComponent = targetEntity.tryGetComponent(CollisionStateComponent, false);
        if (collisionStateComponent)
            collisionStateComponent.add(this.sourceEntity);
        this.sourceEntity.getComponent(CollisionStateComponent)?.add(targetEntity);
        this.setHitboxColor(targetEntity, 0xff0000);
    }

    private onCollisionExit(targetEntity: _Entity): void {
        const collisionStateComponent = targetEntity.tryGetComponent(CollisionStateComponent, false);
        if (collisionStateComponent)
            collisionStateComponent.remove(this.sourceEntity);
        this.sourceEntity.getComponent(CollisionStateComponent)?.remove(targetEntity);
        this.setHitboxColor(targetEntity, 0x00ff00);
    }


    private getPairKey(entityA: _Entity, entityB: _Entity): string {
        return `${entityA.getId()}-${entityB.getId()}`;
    }

    private setHitboxColor(entity: _Entity, color: number): void {
        const helper = entity.getComponents().find(c => c instanceof HitboxHelperComponent);
        if (!helper) return;

        helper.changeColor(new THREE.Color(color));
    }

}

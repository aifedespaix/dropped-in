import { _Component } from '../_Component';
import * as THREE from 'three';
import { RapierPhysicsComponent } from './RapierPhysicsComponent';
import * as RAPIER from '@dimforge/rapier3d-compat';
import type { ServiceLocator } from '~/lib/services/ServiceLocator';
import type { _Entity } from '~/lib/entities/_Entity';
import { HitboxHelperComponent } from '../helpers/HitboxHelperComponent';

export class CollisionDetectionComponent extends _Component {
    private otherEntity: _Entity;
    private isColliding = false;
    private collider: RAPIER.Collider | null = null;
    private otherCollider: RAPIER.Collider | null = null;

    constructor(serviceLocator: ServiceLocator, otherEntity: _Entity) {
        super(serviceLocator);
        this.otherEntity = otherEntity;
    }

    override start(): void {
        const physics = this.entity?.getComponent(RapierPhysicsComponent);
        const otherPhysics = this.otherEntity.getComponent(RapierPhysicsComponent);
        console.log(this.entity.name, physics, otherPhysics);
        this.setupColliders(physics, otherPhysics);
    }

    private setupColliders(physicsComponent: RapierPhysicsComponent, otherPhysicsComponent: RapierPhysicsComponent): void {
        const physicService = this.serviceLocator.get('physics');
        const world = physicService.getWorld();

        // Création d'un collider sphérique pour l'entité principale
        const colliderDesc = RAPIER.ColliderDesc.ball(0.5)
            .setSensor(true) // Utilisation comme capteur pour détecter les collisions
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
            .setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT);

        this.collider = world.createCollider(colliderDesc, physicsComponent.body);

        // Création d'un collider sphérique pour l'autre entité
        const otherColliderDesc = RAPIER.ColliderDesc.ball(0.5)
            .setSensor(true)
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
            .setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT);

        this.otherCollider = world.createCollider(otherColliderDesc, otherPhysicsComponent.body);
    }

    override update(dt: number): void {
        if (!this.collider || !this.otherCollider) return;

        // Vérification des collisions via les événements de collision
        const isColliding = this.checkCollision();
        if (isColliding !== this.isColliding) {
            this.isColliding = isColliding;
            this.handleCollision(isColliding);
        }
    }

    private checkCollision(): boolean {
        if (!this.collider || !this.otherCollider) return false;

        // Vérification de la distance entre les centres des colliders
        const pos1 = this.collider.translation();
        const pos2 = this.otherCollider.translation();

        // Calcul de la distance euclidienne entre les deux points
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const dz = pos1.z - pos2.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Rayon total des deux colliders (0.5 + 0.5 = 1.0)
        const totalRadius = 2.0;
        return distance < totalRadius;
    }

    private handleCollision(isColliding: boolean): void {
        console.log(this.entity.name, isColliding)
        const renderComponent = this.entity?.getComponent(HitboxHelperComponent);
        const color = isColliding ? 0xff0000 : 0x00ff00;  // Rouge si collision, vert sinon
        renderComponent.changeColor(new THREE.Color(color));
    }

    override destroy(): void {
        // Nettoyage des colliders lors de la destruction du composant
        if (this.collider) {
            const physicService = this.serviceLocator.get('physics');
            const world = physicService.getWorld();
            world.removeCollider(this.collider, true);
        }
    }
}

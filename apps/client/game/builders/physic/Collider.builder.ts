import { _Builder } from "../_Builder";
import { ColliderDesc } from "@dimforge/rapier3d-compat";
import type { World, Collider, RigidBodyHandle } from "@dimforge/rapier3d-compat";
import { HitboxComponent, type HitboxType } from "~/game/components/declarative/HitboxCube.component";
import { CubeComponent } from "~/game/components/declarative/Cube.component";
import { SphereComponent } from "~/game/components/declarative/Sphere.component";
import { GlbModelComponent } from "~/game/components/declarative/GlbModel.component";
import type { Entity } from "~/game/entities/Entity";

export interface ColliderBuilderParams {
    entity: Entity;
    world: World;
    bodyHandle: RigidBodyHandle;
}

export class ColliderBuilder extends _Builder<ColliderDesc> {
    override build(params: ColliderBuilderParams): ColliderDesc {
        return this.createCollider(params.entity);
    }

    private createCollider(entity: Entity): ColliderDesc {
        const hitbox = entity.getComponent(HitboxComponent);
        const type = this.resolveHitboxType(entity, hitbox);
        console.log(entity.id);

        let colliderDesc: ColliderDesc;
        switch (type) {
            case 'box':
                const cube = entity.tryGetComponent(CubeComponent);
                if (!cube) throw new Error('Missing CubeComponent for box hitbox.');
                colliderDesc = ColliderDesc.cuboid(cube.size[0] * 0.5, cube.size[1] * 0.5, cube.size[2] * 0.5)
                    .setRestitution(hitbox.restitution)
                    .setFriction(hitbox.friction)
                break;

            case 'sphere':
                const sphere = entity.tryGetComponent(SphereComponent);
                if (!sphere) throw new Error('Missing SphereComponent for sphere hitbox.');
                colliderDesc = ColliderDesc.ball(sphere.radius)
                    .setRestitution(hitbox.restitution)
                    .setFriction(hitbox.friction)
                break;

            case 'capsule':
                // Capsule générique pour Glb
                colliderDesc = ColliderDesc.capsule(0.5, 0.5)
                    .setRestitution(hitbox.restitution)
                    .setFriction(hitbox.friction)
                break;

            default:
                throw new Error(`Unsupported hitbox type: ${type}`);
        }

        return colliderDesc;
    }

    private resolveHitboxType(entity: Entity, hitbox: HitboxComponent): HitboxType {
        if (hitbox.forcedType) return hitbox.forcedType;

        if (entity.tryGetComponent(CubeComponent)) return 'box';
        if (entity.tryGetComponent(SphereComponent)) return 'sphere';
        if (entity.tryGetComponent(GlbModelComponent)) return 'capsule';

        throw new Error('No suitable component found for hitbox shape.');
    }
}

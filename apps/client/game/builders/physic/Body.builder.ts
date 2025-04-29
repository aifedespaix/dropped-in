import { _Builder } from "../_Builder";
import { RigidBodyDesc, RigidBodyType, World, RigidBody } from "@dimforge/rapier3d-compat";

import { PhysicsBodyComponent } from "~/game/components/declarative/PhysicBody.component";
import type { Entity } from "~/game/entities/Entity";

export interface BodyBuilderParams {
    entity: Entity;
}

export class BodyBuilder extends _Builder<RigidBodyDesc> {
    override build(params: BodyBuilderParams): RigidBodyDesc {
        return this.createBody(params.entity);
    }

    private createBody(entity: Entity): RigidBodyDesc {
        const bodyComp = entity.getComponent(PhysicsBodyComponent);

        let desc: RigidBodyDesc;

        switch (bodyComp.rigidBodyType) {
            case RigidBodyType.Dynamic:
                desc = RigidBodyDesc.dynamic();
                break;
            case RigidBodyType.Fixed:
                desc = RigidBodyDesc.fixed();
                break;
            case RigidBodyType.KinematicPositionBased:
                desc = RigidBodyDesc.kinematicPositionBased();
                break;
            case RigidBodyType.KinematicVelocityBased:
                desc = RigidBodyDesc.kinematicVelocityBased();
                break;
            default:
                throw new Error(`Unsupported RigidBodyType: ${bodyComp.type}`);
        }

        // Appliquer les propriétés supplémentaires
        desc.setTranslation(
            entity.transform.position.x,
            entity.transform.position.y,
            entity.transform.position.z
        );
        console.log(entity.transform.rotation);
        desc.setRotation(
            entity.transform.rotation
        );

        // Optionnel : appliquer la masse cible pour Dynamic
        if (bodyComp.rigidBodyType === RigidBodyType.Dynamic && bodyComp.mass !== undefined) {
            desc.setAdditionalMass(bodyComp.mass);
        }

        return desc;
    }
}

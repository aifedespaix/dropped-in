import { _Component } from '../_Component';
import * as RAPIER from '@dimforge/rapier3d-compat';
import type { ServiceLocator } from '~/lib/services/ServiceLocator';
import { _HitboxComponent } from '../hitbox/_HitboxComponent';
import { _RenderComponent } from '../render/_RenderComponent';

type RapierPhysicsComponentType = 'dynamic' | 'static' | 'kinematic';

export type RapierPhysicsComponentOptions = {
    dynamic: boolean;
    position: RAPIER.Vector3;
    rotation: RAPIER.Rotation;
    size: { x: number; y: number; z: number };
    friction: number;
    type: RapierPhysicsComponentType;
    isCcdEnabled?: boolean; // Continuous Collision Detection
};

export class RapierPhysicsComponent extends _Component {
    body!: RAPIER.RigidBody;
    collider!: RAPIER.Collider;
    private _options: RapierPhysicsComponentOptions;

    constructor(serviceLocator: ServiceLocator, options?: Partial<RapierPhysicsComponentOptions>) {
        super(serviceLocator);
        this._options = {
            dynamic: true,
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0, w: 1 },
            size: { x: 1, y: 1, z: 1 },
            friction: 0.5,
            type: 'dynamic',
            isCcdEnabled: false,
            ...options,
        };
    }

    override init(): Promise<void> {
        console.log('init', this.entity?.name, this.entity?.getId(), 'RapierPhysicsComponent');
        const world = this.serviceLocator.get('physics').getWorld();

        const bodyDescBuilder: Record<RapierPhysicsComponentType, () => RAPIER.RigidBodyDesc> = {
            dynamic: () => RAPIER.RigidBodyDesc.dynamic(),
            static: () => RAPIER.RigidBodyDesc.fixed(),
            kinematic: () => RAPIER.RigidBodyDesc.kinematicVelocityBased(),
        };
        const bodyDesc = bodyDescBuilder[this._options.type]();
        if (this._options.isCcdEnabled) {
            bodyDesc.setCcdEnabled(true);
        }

        const { x: px, y: py, z: pz } = this._options.position;
        bodyDesc.setTranslation(px, py, pz);

        const { x: rx, y: ry, z: rz, w: rw } = this._options.rotation;
        bodyDesc.setRotation({ x: rx, y: ry, z: rz, w: rw });

        this.body = world.createRigidBody(bodyDesc);
        return Promise.resolve();
    }

    override start(): void {
        if (!this.entity) {
            console.error('[RapierPhysicsComponent] Entity is undefined. This component is not properly attached to an entity.');
            return;
        }

        const components = this.entity.getComponents();

        const hitbox = components.find(c => c instanceof _HitboxComponent);
        if (!hitbox) {
            console.warn(`[RapierPhysicsComponent] No hitbox found for entity ${this.entity.name} (ID: ${this.entity.getId()})`);
            return;
        }

        const colliderDesc = hitbox.getColliderDesc();

        const world = this.serviceLocator.get('physics').getWorld();
        this.collider = world.createCollider(colliderDesc, this.body);
    }


    isGrounded(): boolean {
        const vel = this.body.linvel();
        return Math.abs(vel.y) < 0.1;
    }

    setVelocity(vel: { x: number; y: number; z: number }) {
        this.body.setLinvel(vel, true);
    }

    getVelocity(): RAPIER.Vector3 {
        return this.body.linvel();
    }

    applyImpulse({ x = 0, y = 0, z = 0 }: { x?: number; y?: number; z?: number }) {
        const impulse = new RAPIER.Vector3(x, y, z);
        this.body.applyImpulse(impulse, true);
    }
}

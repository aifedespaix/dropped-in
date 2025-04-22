import { _Component } from '../_Component';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { RapierPhysicsService } from '../../services/RapierPhysicsService';
import { TransformComponent } from '../transform/TransformComponent';
import { BoundingBoxComponent } from '../BoundingBoxComponent';

export class RapierPhysicsComponent extends _Component {
    body!: RAPIER.RigidBody;
    collider!: RAPIER.Collider;
    private position = { x: 0, y: 0, z: 0 };
    private dynamic: boolean;
    private physicsService: RapierPhysicsService;

    constructor(physicsService: RapierPhysicsService, position = { x: 0, y: 0, z: 0 }, dynamic = true) {
        super();
        this.physicsService = physicsService;
        this.position = position;
        this.dynamic = dynamic;
    }

    override start(): void {
        const world = this.physicsService.getWorld();

        const bodyDesc = this.dynamic
            ? RAPIER.RigidBodyDesc.dynamic()
            : RAPIER.RigidBodyDesc.fixed();

        bodyDesc.setTranslation(this.position.x, this.position.y, this.position.z);

        this.body = world.createRigidBody(bodyDesc);
        console.log("[RapierPhysicsComponent] Body created:", this.body);

        const bbox = this.entity?.tryGetComponent(BoundingBoxComponent);
        if (!bbox) {
            console.warn("[RapierPhysicsComponent] Missing BoundingBoxComponent");
            return;
        }

        bbox.onReady(() => {
            const half = bbox.getHalfSize();
            console.log("[RapierPhysicsComponent] Creating collider with size:", half);

            const colliderDesc = RAPIER.ColliderDesc.cuboid(half.x, half.y, half.z)
                .setRestitution(0.1)
                .setFriction(0.5);

            this.collider = world.createCollider(colliderDesc, this.body);
            console.log("[RapierPhysicsComponent] Collider created:", this.collider);
        });
    }


    isGrounded(): boolean {
        const vel = this.body.linvel();
        return Math.abs(vel.y) < 0.1;
    }

    override update(dt: number): void {
        const transform = this.entity?.getComponent?.(TransformComponent);
        if (transform) {
            const pos = this.body.translation();
            transform.position.x = pos.x;
            transform.position.y = pos.y;
            transform.position.z = pos.z;
        }
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

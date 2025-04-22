import * as RAPIER from '@dimforge/rapier3d-compat';

export class RapierPhysicsService {
    private gravity = new RAPIER.Vector3(0, -9.81, 0);
    private world!: RAPIER.World;

    async init(): Promise<void> {
        await RAPIER.init();
        this.world = new RAPIER.World(this.gravity);
    }

    getWorld(): RAPIER.World {
        return this.world;
    }

    step(): void {
        this.world.step();
    }
}

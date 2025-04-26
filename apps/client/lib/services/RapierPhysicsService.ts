import * as RAPIER from '@dimforge/rapier3d-compat';
import { _Service } from './_Service';
import { GRAVITY } from '~/game/constants';
export class RapierPhysicsService extends _Service {
    private gravity = new RAPIER.Vector3(0, GRAVITY, 0);
    private world!: RAPIER.World;

    override async init(): Promise<void> {
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

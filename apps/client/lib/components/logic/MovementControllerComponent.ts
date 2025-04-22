import { _Component } from '../_Component';
import { RapierPhysicsComponent } from '../physics/RapierPhysicsComponent';
import { Vector3, Vector2 } from 'three';

export class MovementControllerComponent extends _Component {
    private direction = new Vector3();
    private speed = 5;
    private _friction = 0.5;
    private _acceleration = 10;

    setDirection(dir: Vector3) {
        this.direction.copy(dir);
    }

    override update(dt: number): void {
        const physics = this.entity?.tryGetComponent(RapierPhysicsComponent);
        if (!physics) return;

        const velocity = physics.getVelocity();

        const acceleration = Math.pow(this._acceleration, dt * 10); // m/s² → ajustable
        const friction = Math.pow(this._friction, dt * 10); // freinage progressif

        const currentXZ = new Vector2(velocity.x, velocity.z);
        const current = new Vector3(velocity.x, velocity.y, velocity.z);
        let targetXZ = new Vector2(0, 0);

        if (this.direction.lengthSq() > 0) {
            // direction active → calculer la vitesse cible
            const dir2 = new Vector2(this.direction.x, this.direction.z).normalize();
            targetXZ = dir2.multiplyScalar(this.speed);
        } else {
            // pas de direction → ralentir
            targetXZ = currentXZ.multiplyScalar(friction);
        }

        // interpolation linéaire : vitesse += accélération * delta vers la cible
        const nextXZ = currentXZ.lerp(targetXZ, Math.min(1, dt * acceleration));

        // appliquer la nouvelle vitesse
        physics.setVelocity({
            x: nextXZ.x,
            y: current.y,
            z: nextXZ.y
        });
    }


}

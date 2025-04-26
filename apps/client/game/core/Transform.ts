import { Vector3, Quaternion } from "three";
import type { Rotation as RapierRotation, Vector as RapierVector } from "@dimforge/rapier3d-compat"; // types Rapier

export class Transform {
    readonly position = new Vector3();
    readonly rotation = new Quaternion();
    readonly scale = new Vector3(1, 1, 1);

    setPosition(position: Vector3 | RapierVector | [number, number, number]): this {
        if (position instanceof Vector3) {
            this.position.copy(position);
        } else if (Array.isArray(position)) {
            this.position.set(...position);
        } else {
            this.position.set(position.x, position.y, position.z);
        }
        return this;
    }

    addPosition(offset: Vector3 | RapierVector | [number, number, number]): this {
        if (offset instanceof Vector3) {
            this.position.add(offset);
        } else if (Array.isArray(offset)) {
            this.position.add(new Vector3(...offset));
        } else {
            this.position.add(new Vector3(offset.x, offset.y, offset.z));
        }
        return this;
    }

    setRotation(rotation: Quaternion | RapierRotation): this {
        if (rotation instanceof Quaternion) {
            this.rotation.copy(rotation);
        } else {
            this.rotation.set(rotation.x, rotation.y, rotation.z, rotation.w);
        }
        return this;
    }

    setScale(scale: Vector3 | [number, number, number]): this {
        if (scale instanceof Vector3) {
            this.scale.copy(scale);
        } else {
            this.scale.set(...scale);
        }
        return this;
    }

    copyFrom(other: Transform): this {
        this.position.copy(other.position);
        this.rotation.copy(other.rotation);
        this.scale.copy(other.scale);
        return this;
    }

    teleport(position: Vector3 | [number, number, number], rotation?: Quaternion | RapierRotation): this {
        this.setPosition(position);
        if (rotation) this.setRotation(rotation);
        return this;
    }
}

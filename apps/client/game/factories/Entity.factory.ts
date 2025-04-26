import { _Entity } from "../entities/_Entity";
import { _Factory } from "./_Factory";
import { CubeEntity } from "../entities/Cube.entity";
import type { _Component } from "../components/_Component";
import { ComponentSource } from "../components/_Component";
import { HitboxCubeComponent } from "../components/declarative/HitboxCube.component";
import { PhysicsBodyComponent } from "../components/declarative/PhysicBody.component";
import type { IPosition, ISize } from "../types/I3D";
import { RigidBodyType } from "@dimforge/rapier3d-compat";
import { CubeComponent } from "../components/declarative/Cube.component";
import { KinematicControllerComponent } from "../components/declarative/KinematicController.component";
import { KinematicGravityComponent } from "../components/declarative/KinematicGravity.component";
import { PlayerFlagComponent } from "../components/declarative/PlayerFlag.component";

export class EntityFactory extends _Factory<_Entity> {
    createCube(): CubeEntity {
        const cube = new CubeEntity();
        const size = [1, 1, 1] as ISize;
        const restitution = 0.0;
        const friction = 500;
        const color = 0xee3030;
        const mass = 0.1;
        cube.transform.setPosition([0, 10, 0]);

        this.#addComponentToEntity(cube, new CubeComponent(size, color))
        this.#addComponentToEntity(cube, new HitboxCubeComponent(size, restitution, friction))
        this.#addComponentToEntity(cube, new PhysicsBodyComponent(RigidBodyType.Dynamic, mass))
        return cube;
    }

    createFloor(): CubeEntity {
        const floor = new CubeEntity();

        const size = [100, 1, 100] as ISize;
        const position = [0, -1, 0] as IPosition;
        const restitution = 0.0;
        const friction = 0.5;
        const color = 0x80aa80;

        floor.transform.setPosition(position);

        this.#addComponentToEntity(floor, new CubeComponent(size, color))
        this.#addComponentToEntity(floor, new HitboxCubeComponent(size, restitution, friction))
        this.#addComponentToEntity(floor, new PhysicsBodyComponent(RigidBodyType.Fixed, 0))
        return floor;
    }

    createPlayer(): CubeEntity {
        const player = new CubeEntity('player');
        const size = [0.6, 1.8, 0.6] as ISize;
        const restitution = 0.0;
        const friction = 0.5;
        const color = 0x8080cc;
        const mass = 80;
        const position = [0, 2, 0] as IPosition;

        player.transform.setPosition(position);

        this.#addComponentToEntity(player, new PlayerFlagComponent())

        this.#addComponentToEntity(player, new CubeComponent(size, color))
        this.#addComponentToEntity(player, new HitboxCubeComponent(size, restitution, friction))
        this.#addComponentToEntity(player, new PhysicsBodyComponent(RigidBodyType.KinematicPositionBased, mass))

        this.#addComponentToEntity(player, new KinematicControllerComponent(position))
        this.#addComponentToEntity(player, new KinematicGravityComponent())

        return player;
    }

    #addComponentToEntity<T extends _Component>(entity: _Entity, component: T): void {
        entity.addComponentSafe(component, ComponentSource.Factory);
    }

}
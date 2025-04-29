import { Entity } from "../entities/Entity";
import { _Factory } from "./_Factory";
import type { _Component } from "../components/_Component";
import { ComponentSource } from "../components/_Component";
import { HitboxComponent } from "../components/declarative/HitboxCube.component";
import { PhysicsBodyComponent } from "../components/declarative/PhysicBody.component";
import type { IPosition, ISize } from "../types/I3D";
import { RigidBodyType } from "@dimforge/rapier3d-compat";
import { CubeComponent } from "../components/declarative/Cube.component";
import { KinematicControllerComponent } from "../components/declarative/KinematicController.component";
import { KinematicGravityComponent } from "../components/declarative/KinematicGravity.component";
import { PlayerFlagComponent } from "../components/declarative/PlayerFlag.component";
import { RotationRequestComponent } from "../components/declarative/RotationRequest.component";
import type { MaterialType } from "./Material.factory";
import { SphereComponent } from "../components/declarative/Sphere.component";
import { ColliderDebugComponent } from "../components/declarative/ColliderDebug.component";
import { MoveBetweenPointsComponent, MoveMode } from "../components/declarative/MoveBetweenPoints.component";
import { RotateComponent } from "../components/declarative/Rotate.component";
import { Euler, Quaternion } from "three";

export class EntityFactory extends _Factory<Entity> {
    createCube(): Entity {
        const cube = new Entity('cube');
        const size = [1, 1, 1] as ISize;
        const restitution = 0.0;
        const friction = 500;
        const color = 0xee3030;
        const mass = 0.1;
        cube.transform.setPosition([0, 10, 0]);

        this.#addComponentToEntity(cube, new CubeComponent(size, color))
        this.#addComponentToEntity(cube, new HitboxComponent(restitution, friction))
        this.#addComponentToEntity(cube, new PhysicsBodyComponent(RigidBodyType.Dynamic, mass))
        this.#addComponentToEntity(cube, new ColliderDebugComponent())
        return cube;
    }

    createSphere(): Entity {
        const entity = new Entity();
        const radius = 0.25;
        const size = [radius, 0.1, radius] as ISize;
        const color = 0xaaaaee;
        const restitution = 0.0;
        const friction = 0.5;

        entity.transform.setPosition([0, 5, 20]);

        this.#addComponentToEntity(entity, new SphereComponent(radius, color, false, 'standard', { roughness: 0.8 }));
        this.#addComponentToEntity(entity, new HitboxComponent(restitution, friction))
        this.#addComponentToEntity(entity, new PhysicsBodyComponent(RigidBodyType.Dynamic, 0))
        this.#addComponentToEntity(entity, new ColliderDebugComponent())

        return entity;
    }

    createRamp(): Entity {
        const entity = new Entity('ramp');
        const size = [2, 0.1, 20] as ISize;
        const position = [0, 0, 15] as IPosition;
        const restitution = 0.0;
        const friction = 0.5;
        const color = 0x339933;
        const materialType: MaterialType = 'phong';
        const eulerRotation = new Euler(-Math.PI / 6, 0, 0);
        const rotation = new Quaternion().setFromEuler(eulerRotation);

        entity.transform.setPosition(position);
        entity.transform.setRotation(rotation);

        this.#addComponentToEntity(entity, new CubeComponent(size, color, false, materialType))
        this.#addComponentToEntity(entity, new HitboxComponent(restitution, friction))
        this.#addComponentToEntity(entity, new PhysicsBodyComponent(RigidBodyType.Fixed, 0))

        return entity;
    }

    createRotatingPlatform(): Entity {
        const entity = new Entity('rotatingPlatform');
        const size = [6, 2, 0.1] as ISize;
        const positionFrom = [0, 0.5, 5] as IPosition;
        const restitution = 0.0;
        const friction = 0.5;
        const color = 0xaaaa80;
        const materialType: MaterialType = 'phong';
        const speed = 10;

        entity.transform.setPosition(positionFrom);

        this.#addComponentToEntity(entity, new CubeComponent(size, color, false, materialType))
        this.#addComponentToEntity(entity, new HitboxComponent(restitution, friction))
        this.#addComponentToEntity(entity, new PhysicsBodyComponent(RigidBodyType.Dynamic, 0))
        this.#addComponentToEntity(entity, new RotateComponent([0, 1, 0], speed))

        return entity;
    }

    createMovingPlatform(): Entity {
        const entity = new Entity('movingPlatform');

        const size = [2, 0.1, 2] as ISize;
        const positionFrom = [0, -0.5, 0] as IPosition;
        const positionTo = [0, 3, 0] as IPosition;
        const restitution = 0.0;
        const friction = 0.5;
        const color = 0xaaaa80;
        const materialType: MaterialType = 'phong';

        entity.transform.setPosition(positionFrom);

        this.#addComponentToEntity(entity, new CubeComponent(size, color, false, materialType))
        this.#addComponentToEntity(entity, new HitboxComponent(restitution, friction))
        this.#addComponentToEntity(entity, new PhysicsBodyComponent(RigidBodyType.KinematicPositionBased, 0))
        this.#addComponentToEntity(entity, new MoveBetweenPointsComponent(positionFrom, positionTo, 1, MoveMode.PingPong))

        return entity;
    }

    createFloor(): Entity {
        const floor = new Entity('floor');

        const size = [100, 1, 100] as ISize;
        const position = [0, -1, 0] as IPosition;
        const restitution = 0.0;
        const friction = 0.5;
        const color = 0x80aa80;
        const materialType: MaterialType = 'phong';

        floor.transform.setPosition(position);

        this.#addComponentToEntity(floor, new CubeComponent(size, color, false, materialType))
        this.#addComponentToEntity(floor, new HitboxComponent(restitution, friction))
        this.#addComponentToEntity(floor, new PhysicsBodyComponent(RigidBodyType.Fixed, 0))
        return floor;
    }

    createPlayer(): Entity {
        const player = new Entity('player');
        const size = [0.6, 1.8, 0.6] as ISize;
        const restitution = 0.0;
        const friction = 0.5;
        const color = 0x8080cc;
        const mass = 80;
        const position = [0, 2, 0] as IPosition;

        player.transform.setPosition(position);

        this.#addComponentToEntity(player, new PlayerFlagComponent())

        this.#addComponentToEntity(player, new CubeComponent(size, color))
        this.#addComponentToEntity(player, new PhysicsBodyComponent(RigidBodyType.KinematicPositionBased, mass))
        this.#addComponentToEntity(player, new HitboxComponent(restitution, friction))
        this.#addComponentToEntity(player, new ColliderDebugComponent())

        this.#addComponentToEntity(player, new KinematicControllerComponent(position))
        this.#addComponentToEntity(player, new KinematicGravityComponent())
        this.#addComponentToEntity(player, new RotationRequestComponent())

        return player;
    }

    #addComponentToEntity<T extends _Component>(entity: Entity, component: T): void {
        entity.addComponentSafe(component, ComponentSource.Factory);
    }

}
import * as THREE from 'three';
import { _System } from './_System';
import { ServiceLocator } from '../services/ServiceLocator';
import { InputService } from '../services/InputService';
import type { PlayerEntity } from '../entities/kinematicPositionBased/Player.entity';
import { RapierPhysicsComponent } from '../components/physics/RapierPhysicsComponent';
import { clamp } from '../utils/Math';
type CameraMode = 'FPS' | 'TPS' | 'TopDown' | 'TopDownFree'

export class CameraSystem extends _System {
    private mouseSensitivityPercent = 10;
    private minSensitivity = 0.001;
    private maxSensitivity = 0.01;
    private _camera: THREE.Camera;
    private _playerPhysics: RapierPhysicsComponent;
    private _inputService: InputService;

    private yawObject: THREE.Object3D;
    private pitchObject: THREE.Object3D;

    private pitch = 0;
    private yaw = 0;

    private mode: CameraMode = 'FPS';

    constructor(
        private serviceLocator: ServiceLocator,
        private playerEntity: PlayerEntity
    ) {
        super();
        this._inputService = this.serviceLocator.get('input');
        this._playerPhysics = this.playerEntity.getComponent(RapierPhysicsComponent);
        this._camera = this.serviceLocator.get('render').camera;

        this.yawObject = new THREE.Object3D();       // rotation Y (horizontal)
        this.pitchObject = new THREE.Object3D();     // rotation X (vertical)
        this.yawObject.add(this.pitchObject);
        this.pitchObject.add(this._camera);
        this._placeCamera();
    }

    setMode(mode: CameraMode): void {
        if (this.mode === mode) return;
        this.mode = mode;
        this._placeCamera();
    }

    public setMouseSensitivityPercent(percent: number): void {
        this.mouseSensitivityPercent = clamp(percent, 0, 100);
    }

    override update(dt: number): void {
        switch (this.mode) {
            case 'FPS':
                this.updateFPS();
                break;
            case 'TPS':
                this.updateTPS();
                break;
            case 'TopDown':
                this.updateTopDown();
                break;
            case 'TopDownFree':
                this.updateFree();
                break;
        }
    }

    private _placeCamera(): void {
        const playerObject = this.playerEntity.getRenderableObject();
        this._camera.position.set(0, 0, 0);
        this._camera.rotation.set(0, 0, 0);
        playerObject?.parent?.remove(this.yawObject);

        switch (this.mode) {
            case 'FPS':
                console.log("FPS");
                playerObject?.add(this.yawObject);
                this.yawObject.position.set(0, 1.8, 0);
                break;
            case 'TPS':
                this.yawObject.position.set(0, 3, -4);
                this.yawObject.lookAt(0, 3, 0)
                playerObject?.add(this.yawObject);
                break;
            case 'TopDown':
                this.yawObject.position.set(0, 10, -10);
                playerObject?.add(this.yawObject);
                break;
        }
    }

    private updateFPS(): void {
        const { dx, dy } = this._inputService.getMouseDelta();

        const sensitivity = THREE.MathUtils.lerp(this.minSensitivity, this.maxSensitivity, this.mouseSensitivityPercent / 100);
        const dyaw = -dx * sensitivity;
        const dpitch = -dy * sensitivity;

        // Appliquer le yaw au physics uniquement
        this._playerPhysics.addYawRotation(dyaw);

        // Appliquer le pitch à la caméra uniquement
        this.pitch += dpitch;
        this.pitch = clamp(this.pitch, -Math.PI / 2, Math.PI / 2);
        this.pitchObject.rotation.x = clamp(this.pitch, -0.9, 0.9);
    }

    private updateTPS(): void {
        // const offset = new THREE.Vector3(0, 3, -4);
        // const rotatedOffset = offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.yaw);
        // const playerTranslation = this._playerPhysics.body.translation();
        // const playerPosition = new THREE.Vector3(playerTranslation.x, playerTranslation.y, playerTranslation.z);
        // this.yawObject.position.copy(playerPosition.add(rotatedOffset));

        // this.yawObject.lookAt(new THREE.Vector3(0, 2, 0));

        // this._playerPhysics.rotateY(dyaw);
    }

    private updateTopDown(): void {

        // this._cameraTransform.position.set(
        //     this._playerPhysics.position.x,
        //     this._playerPhysics.position.y + 20,
        //     this._playerPhysics.position.z
        // );

        // this._cameraTransform.lookAt = this._playerPhysics.position;
    }

    private updateFree(): void {
        // À compléter plus tard : gestion WASD + souris + altitude
    }
}

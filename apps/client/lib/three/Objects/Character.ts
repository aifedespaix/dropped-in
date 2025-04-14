import * as THREE from 'three'
import type { CharacterActionState } from '../types/CharacterActions'
import { GLTFObject } from './GLTFObject'
import { GLTFObjectType } from '../Utils/GLTFLoader'
import type { GLTFLoadOptions } from '../Utils/GLTFLoader'
import { CharacterPhysics } from '../../rapier/CharacterPhysics'
import { PhysicsEngine } from '../../rapier/PhysicsEngine'

export class Character extends GLTFObject {
    private verticalRotation = 0
    private horizontalRotation = 0
    private readonly MAX_VERTICAL_ANGLE = Math.PI / 2
    private readonly MIN_VERTICAL_ANGLE = -Math.PI / 2
    private bodyQuaternion = new THREE.Quaternion()
    private cameraQuaternion = new THREE.Quaternion()
    private characterPhysics: CharacterPhysics | null = null

    constructor() {
        super(GLTFObjectType.CHARACTER)
        this.mesh.position.y = 1.75
    }

    public override async loadFromGLTF(url: string, options?: Partial<GLTFLoadOptions>): Promise<void> {
        const defaultOptions: GLTFLoadOptions = {
            type: GLTFObjectType.CHARACTER,
            position: new THREE.Vector3(0, 1.75, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1),
            addToScene: true,
            addToPhysics: true,
            mass: 1,
            lockRotation: true
        }

        const finalOptions = { ...defaultOptions, ...options }
        await super.loadFromGLTF(url, finalOptions)
    }

    updateVerticalRotation(delta: number) {
        this.verticalRotation = Math.max(
            this.MIN_VERTICAL_ANGLE,
            Math.min(this.MAX_VERTICAL_ANGLE, this.verticalRotation + delta)
        )
        this.updateRotations()
    }

    updateHorizontalRotation(delta: number) {
        this.horizontalRotation += delta
        this.horizontalRotation = this.horizontalRotation % (2 * Math.PI)
        this.updateRotations()
    }

    private updateRotations() {
        this.bodyQuaternion.setFromEuler(new THREE.Euler(0, this.horizontalRotation, 0))
        this.cameraQuaternion.setFromEuler(new THREE.Euler(this.verticalRotation, 0, 0))

        if (this.characterPhysics) {
            this.characterPhysics.getRigidBody().setRotation(
                this.bodyQuaternion,
                true
            )
        }
    }

    override getPosition(): THREE.Vector3 {
        if (this.characterPhysics) {
            return this.characterPhysics.getPosition()
        }
        return this.mesh.position.clone()
    }

    public getRotationMatrix(): THREE.Matrix4 {
        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromEuler(new THREE.Euler(this.verticalRotation, this.horizontalRotation, 0))
        return matrix
    }

    move(direction: THREE.Vector3) {
        console.log('Moving character...')
        console.log('Direction:', direction)
        console.log('Horizontal rotation:', this.horizontalRotation)

        console.log('Character physics:', this.characterPhysics)
        if (this.characterPhysics) {
            this.characterPhysics.move(direction, this.horizontalRotation)
        }
    }

    protected override setupPhysics(mass: number, lockRotation: boolean): void {
        if (this.physicsEngine) {
            this.characterPhysics = new CharacterPhysics(this.physicsEngine, this.mesh)
        }
    }

    public override update(deltaTime: number): void {
        super.update(deltaTime)
        if (this.characterPhysics) {
            this.characterPhysics.updateLastValidPosition()
        }
    }

    public canMove(): boolean {
        return this.characterPhysics ? this.characterPhysics.canMove() : false;
    }
}

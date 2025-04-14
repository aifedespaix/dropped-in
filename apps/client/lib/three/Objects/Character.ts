import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d-compat'
import type { CharacterActionState } from '../types/CharacterActions'
import { GLTFObject } from './GLTFObject'
import { GLTFObjectType } from '../Utils/GLTFLoader'
import type { GLTFLoadOptions } from '../Utils/GLTFLoader'
import { PhysicsObject } from '../../rapier/PhysicsObject'
import { PhysicsEngine } from '../../rapier/PhysicsEngine'

export class Character extends GLTFObject {
    private speed = 5.0
    private jumpForce = 5.0
    private verticalRotation = 0
    private horizontalRotation = 0
    private readonly MAX_VERTICAL_ANGLE = Math.PI / 2 // 90 degrés
    private readonly MIN_VERTICAL_ANGLE = -Math.PI / 2 // -90 degrés
    private bodyQuaternion = new THREE.Quaternion()
    private cameraQuaternion = new THREE.Quaternion()
    private lastValidPosition: THREE.Vector3
    private readonly KILL_ZONE_Y = -10
    private isGrounded = false
    private readonly GROUND_CHECK_DISTANCE = 0.1
    private readonly GROUND_CHECK_OFFSET = 0.5

    constructor() {
        super(GLTFObjectType.CHARACTER)
        this.lastValidPosition = new THREE.Vector3(0, 1.75, 0)
        this.mesh.position.y = 1.75
    }

    /**
     * Charge un personnage à partir d'un fichier GLTF
     * @param url URL du fichier GLTF
     * @param options Options de chargement
     */
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
        // Normaliser la rotation entre 0 et 2π
        this.horizontalRotation = this.horizontalRotation % (2 * Math.PI)
        this.updateRotations()
    }

    private updateRotations() {
        // Optimiser les calculs de rotation en utilisant des quaternions directement
        this.bodyQuaternion.setFromEuler(new THREE.Euler(0, this.horizontalRotation, 0))
        this.cameraQuaternion.setFromEuler(new THREE.Euler(this.verticalRotation, 0, 0))

        // Synchroniser la rotation du corps avec Rapier seulement si nécessaire
        if (this.physicsObject) {
            const rigidBody = this.physicsObject.getRigidBody()
            rigidBody.setRotation(
                new RAPIER.Quaternion(
                    this.bodyQuaternion.x,
                    this.bodyQuaternion.y,
                    this.bodyQuaternion.z,
                    this.bodyQuaternion.w
                ),
                true
            )
        }
    }

    override getPosition(): THREE.Vector3 {
        if (this.physicsObject) {
            const position = this.physicsObject.getRigidBody().translation()
            return new THREE.Vector3(position.x, position.y, position.z)
        }
        return this.mesh.position.clone()
    }

    public getRotationMatrix(): THREE.Matrix4 {
        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromEuler(new THREE.Euler(this.verticalRotation, this.horizontalRotation, 0))
        return matrix
    }

    /**
     * Vérifie si le personnage peut se déplacer
     * @returns boolean
     */
    public canMove(): boolean {
        return this.physicsObject !== null && this.mesh !== null
    }

    private checkGrounded() {
        if (!this.physicsObject) return false;

        const rigidBody = this.physicsObject.getRigidBody();
        const position = rigidBody.translation();

        // Optimiser la détection du sol en utilisant un rayon plus court
        const rayOrigin = new RAPIER.Vector3(
            position.x,
            position.y + this.GROUND_CHECK_OFFSET,
            position.z
        );
        const rayDirection = new RAPIER.Vector3(0, -1, 0);
        const ray = new RAPIER.Ray(rayOrigin, rayDirection);

        // Réduire la distance de vérification
        const hit = this.physicsObject.getPhysicsEngine()
            .getWorld()
            .castRay(ray, this.GROUND_CHECK_DISTANCE * 0.5, true);

        this.isGrounded = hit !== null;
        return this.isGrounded;
    }

    move(direction: THREE.Vector3) {
        if (!this.physicsObject) return

        // Vérifier si le personnage est au sol seulement si nécessaire
        if (direction.y > 0) {
            this.checkGrounded()
        }

        // Optimiser le calcul de la direction de mouvement
        const moveDirection = new THREE.Vector3()
        moveDirection.copy(direction)

        // Appliquer la rotation uniquement sur le plan horizontal
        const horizontalRotation = new THREE.Euler(0, this.horizontalRotation, 0)
        moveDirection.applyEuler(horizontalRotation)
        moveDirection.y = 0

        // Vérifier que les valeurs sont valides
        if (isNaN(moveDirection.x) || isNaN(moveDirection.z)) {
            return
        }

        // Optimiser l'application de la vélocité
        const speed = this.speed
        const rapierDirection = new RAPIER.Vector3(
            moveDirection.x * speed,
            0,
            moveDirection.z * speed
        )

        // Appliquer la vélocité linéaire
        this.physicsObject.getRigidBody().setLinvel(rapierDirection, true)

        // Vérifier la position de manière optimisée
        const position = this.physicsObject.getRigidBody().translation()
        if (position.y < this.KILL_ZONE_Y) {
            this.respawn()
        }
    }

    /**
     * Réapparaît à la dernière position valide
     * @private
     */
    private respawn(): void {
        if (!this.physicsObject) return

        const rigidBody = this.physicsObject.getRigidBody()

        // Réinitialiser la position et la vélocité
        rigidBody.setTranslation(
            new RAPIER.Vector3(
                this.lastValidPosition.x,
                this.lastValidPosition.y,
                this.lastValidPosition.z
            ),
            true
        )
        rigidBody.setLinvel(new RAPIER.Vector3(0, 0, 0), true)
        rigidBody.setAngvel(new RAPIER.Vector3(0, 0, 0), true)
    }

    /**
     * Met à jour le personnage
     * @param deltaTime Temps écoulé depuis la dernière mise à jour
     */
    public override update(deltaTime: number): void {
        super.update(deltaTime)
    }

    override getMesh(): THREE.Group {
        return super.getMesh()
    }

    protected override setupPhysics(mass: number, lockRotation: boolean): void {
        this.physicsObject = new PhysicsObject(
            this.physicsEngine,
            this.mesh,
            {
                type: 'dynamic',
                mass: mass,
                friction: 0.3,
                restitution: 0.0,
                colliderType: 'capsule',
                colliderSize: new THREE.Vector3(0.5, 1.75, 0.5),
                lockRotation: lockRotation
            }
        )
    }
}

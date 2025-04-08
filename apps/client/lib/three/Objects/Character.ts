import * as THREE from 'three'
import type { CharacterActionState } from '../types/CharacterActions'

export class Character {
    public mesh: THREE.Mesh
    public velocity = new THREE.Vector3()
    private speed = 0.1
    private jumpForce = 0.5
    private gravity = 0.05
    private isGrounded = true
    private verticalRotation = 0
    private readonly MAX_VERTICAL_ANGLE = Math.PI / 2 // 90 degrés
    private readonly MIN_VERTICAL_ANGLE = -Math.PI / 2 // -90 degrés
    private rotationQuaternion = new THREE.Quaternion()

    constructor() {
        const geometry = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8)
        const material = new THREE.MeshStandardMaterial({ color: 0x0000ff })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.y = 1
        this.updateRotationQuaternion()
    }

    updateVerticalRotation(delta: number) {
        this.verticalRotation = Math.max(
            this.MIN_VERTICAL_ANGLE,
            Math.min(this.MAX_VERTICAL_ANGLE, this.verticalRotation + delta)
        )
        this.updateRotationQuaternion()
    }

    getVerticalRotation(): number {
        return this.verticalRotation
    }

    private updateRotationQuaternion() {
        // Créer un quaternion pour la rotation horizontale (Y)
        const horizontalQuat = new THREE.Quaternion()
        horizontalQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.mesh.rotation.y)

        // Créer un quaternion pour la rotation verticale (X)
        const verticalQuat = new THREE.Quaternion()
        verticalQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.verticalRotation)

        // Appliquer d'abord la rotation horizontale, puis la rotation verticale
        this.rotationQuaternion.multiplyQuaternions(horizontalQuat, verticalQuat)
    }

    getRotationMatrix(): THREE.Matrix4 {
        const matrix = new THREE.Matrix4()
        matrix.makeRotationFromQuaternion(this.rotationQuaternion)
        return matrix
    }

    move(input: CharacterActionState) {
        // Gestion du saut
        if (input.jump && this.isGrounded) {
            this.velocity.y = this.jumpForce
            this.isGrounded = false
        }

        // Application de la gravité
        if (!this.isGrounded) {
            this.velocity.y -= this.gravity
        }

        // Calcul du mouvement horizontal
        const moveDirection = new THREE.Vector3(0, 0, 0)

        // Créer un vecteur de direction basé sur la rotation du personnage
        const direction = new THREE.Vector3(0, 0, -1)
        direction.applyQuaternion(this.rotationQuaternion)

        if (input.forward) {
            moveDirection.add(direction.multiplyScalar(this.speed))
        }
        if (input.backward) {
            moveDirection.add(direction.multiplyScalar(-this.speed))
        }

        // Vecteur perpendiculaire pour le mouvement latéral
        const rightVector = new THREE.Vector3(1, 0, 0)
        rightVector.applyQuaternion(this.rotationQuaternion)

        if (input.right) {
            moveDirection.add(rightVector.multiplyScalar(this.speed))
        }
        if (input.left) {
            moveDirection.add(rightVector.multiplyScalar(-this.speed))
        }

        // Mise à jour de la vélocité horizontale
        this.velocity.x = moveDirection.x
        this.velocity.z = moveDirection.z

        // Mise à jour de la position
        this.mesh.position.add(this.velocity)

        // Détection du sol
        if (this.mesh.position.y <= 1) {
            this.mesh.position.y = 1
            this.velocity.y = 0
            this.isGrounded = true
        }
    }
}

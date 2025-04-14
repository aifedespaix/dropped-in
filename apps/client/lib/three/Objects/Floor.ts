import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d-compat'
import { PhysicsObject } from '../../rapier/PhysicsObject'
import { PhysicsEngine } from '../../rapier/PhysicsEngine'

export class Floor {
    private mesh: THREE.Mesh
    private physicsObject: PhysicsObject
    private readonly SIZE = 20
    private readonly THICKNESS = 1

    constructor(physicsEngine: PhysicsEngine) {
        // Créer le mesh du sol
        const geometry = new THREE.BoxGeometry(this.SIZE, this.THICKNESS, this.SIZE)
        const material = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.7,
            metalness: 0.1
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.y = -this.THICKNESS / 2

        // Créer l'objet physique
        this.physicsObject = new PhysicsObject(
            physicsEngine,
            this.mesh,
            {
                type: 'fixed',
                mass: 0,
                friction: 0.7,
                restitution: 0.0,
                colliderType: 'cuboid',
                colliderSize: new THREE.Vector3(this.SIZE / 2, this.THICKNESS / 2, this.SIZE / 2),
                lockRotation: true
            }
        )

        console.log('Floor created with physics:', {
            position: this.mesh.position,
            size: this.SIZE,
            thickness: this.THICKNESS
        })
    }

    getMesh(): THREE.Mesh {
        return this.mesh
    }

    getPhysicsObject(): PhysicsObject {
        return this.physicsObject
    }
} 
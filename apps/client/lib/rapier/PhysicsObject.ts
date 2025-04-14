import * as RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { PhysicsEngine } from './PhysicsEngine';

export class PhysicsObject {
    private rigidBody: RAPIER.RigidBody;
    private collider!: RAPIER.Collider;
    private mesh: THREE.Object3D;
    private isStatic: boolean;
    private physicsEngine: PhysicsEngine;

    constructor(
        physicsEngine: PhysicsEngine,
        mesh: THREE.Object3D,
        options: {
            type: 'fixed' | 'dynamic',
            mass: number,
            friction: number,
            restitution: number,
            colliderType: 'cuboid' | 'capsule' | 'sphere',
            colliderSize: THREE.Vector3,
            lockRotation?: boolean
        }
    ) {
        this.physicsEngine = physicsEngine;
        this.mesh = mesh;
        this.isStatic = options.type === 'fixed';

        console.log('Creating physics object:', {
            position: mesh.position,
            mass: options.mass,
            isStatic: this.isStatic,
            colliderType: options.colliderType,
            colliderSize: options.colliderSize,
            lockRotation: options.lockRotation
        });

        // Créer le corps rigide
        const rigidBodyDesc = this.isStatic
            ? RAPIER.RigidBodyDesc.fixed()
            : RAPIER.RigidBodyDesc.dynamic();

        // S'assurer que les composantes sont des nombres
        const x = Number(mesh.position.x) || 0;
        const y = Number(mesh.position.y) || 0;
        const z = Number(mesh.position.z) || 0;

        rigidBodyDesc.setTranslation(x, y, z);
        if (options.lockRotation) {
            rigidBodyDesc.lockRotations();
        }

        this.rigidBody = this.physicsEngine.getWorld().createRigidBody(rigidBodyDesc);
        console.log('Rigid body created:', this.rigidBody);

        // Créer le collider
        this.createCollider(options);
    }

    private createCollider(options: {
        type: 'fixed' | 'dynamic',
        mass: number,
        friction: number,
        restitution: number,
        colliderType: 'cuboid' | 'capsule' | 'sphere',
        colliderSize: THREE.Vector3
    }) {
        let colliderDesc: RAPIER.ColliderDesc;

        // Utiliser un cuboïde pour le sol, une capsule pour le personnage
        if (this.isStatic && this.mesh instanceof THREE.Mesh && this.mesh.geometry instanceof THREE.PlaneGeometry) {
            // Pour le sol, utiliser un cuboïde plat
            const width = (this.mesh.geometry as THREE.PlaneGeometry).parameters.width;
            const height = (this.mesh.geometry as THREE.PlaneGeometry).parameters.height;
            // Créer un cuboïde plat avec la hauteur comme épaisseur
            colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2, 0.1, height / 2);

            // Appliquer la rotation du sol au collider pour qu'il soit horizontal
            const qx = Math.sin(-Math.PI / 4);
            const qw = Math.cos(-Math.PI / 4);
            colliderDesc.setRotation({ x: qx, y: 0, z: 0, w: qw });

            // Augmenter la friction pour le sol et désactiver la restitution
            colliderDesc.setFriction(1.0);
            colliderDesc.setRestitution(0.0);
            colliderDesc.setSensor(false);
            colliderDesc.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT);

            console.log('Creating floor collider with dimensions:', { width, height });
        } else if (this.mesh instanceof THREE.Group) {
            // Pour le personnage en forme de pilule, utiliser une capsule
            const radius = 0.5;
            const height = 2.0;
            colliderDesc = RAPIER.ColliderDesc.capsule(height / 2, radius);

            // Configurer les propriétés physiques pour le personnage
            colliderDesc.setFriction(0.7);
            colliderDesc.setRestitution(0.3);
            colliderDesc.setSensor(false);
            colliderDesc.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT);

            // Ajouter un offset pour le collider du personnage
            colliderDesc.setTranslation(0, height / 2, 0);

            console.log('Creating character capsule collider with dimensions:', { radius, height });
        } else {
            // Pour les autres objets, utiliser une sphère
            colliderDesc = RAPIER.ColliderDesc.ball(1.0);

            // Configurer les propriétés physiques
            colliderDesc.setFriction(0.7);
            colliderDesc.setRestitution(0.3);
            colliderDesc.setSensor(false);
            colliderDesc.setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.DEFAULT);
        }

        // Créer le collider
        this.collider = this.physicsEngine.getWorld().createCollider(colliderDesc, this.rigidBody);
        console.log('Collider created:', this.collider);
    }

    public update() {
        if (!this.rigidBody) return;

        // Récupérer la position et la rotation du corps rigide
        const position = this.rigidBody.translation();
        const rotation = this.rigidBody.rotation();

        // Mettre à jour la position et la rotation du mesh
        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);

        // Vérifier si le personnage tombe trop bas (en dessous de -10)
        if (position.y < -10) {
            console.warn('Character fell too low, resetting position');
            // Réinitialiser la position du personnage
            this.rigidBody.setTranslation(new RAPIER.Vector3(0, 3, 0), true);
            // Réinitialiser la vélocité
            this.rigidBody.setLinvel(new RAPIER.Vector3(0, 0, 0), true);
            this.rigidBody.setAngvel(new RAPIER.Vector3(0, 0, 0), true);
        }

        // Log pour le débogage (uniquement pour le personnage et moins fréquemment)
        if (this.mesh instanceof THREE.Group && Math.random() < 0.01) { // ~1% des frames
            console.log('Character position:', {
                y: position.y.toFixed(2),
                velocity: this.rigidBody.linvel().y.toFixed(2)
            });
        }
    }

    public getRigidBody(): RAPIER.RigidBody {
        return this.rigidBody;
    }

    public getCollider(): RAPIER.Collider {
        return this.collider;
    }

    public getPhysicsEngine(): PhysicsEngine {
        return this.physicsEngine;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh as THREE.Mesh;
    }

    public dispose() {
        if (this.rigidBody) {
            this.physicsEngine.getWorld().removeRigidBody(this.rigidBody);
        }
    }
} 
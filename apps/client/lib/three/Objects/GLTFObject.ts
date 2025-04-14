import * as THREE from 'three'
import { GLTFLoader, GLTFObjectType, type GLTFLoadOptions } from '../Utils/GLTFLoader'
import { PhysicsObject } from '~/lib/rapier/PhysicsObject'
import * as RAPIER from '@dimforge/rapier3d-compat'
import { PhysicsEngine } from '~/lib/rapier/PhysicsEngine'

/**
 * Classe de base pour les objets GLTF
 */
export abstract class GLTFObject {
    public mesh: THREE.Group
    public physicsObject?: PhysicsObject
    protected gltfLoader: GLTFLoader
    protected animations: THREE.AnimationClip[] = []
    protected mixer?: THREE.AnimationMixer
    protected currentAction?: THREE.AnimationAction
    protected physicsEngine: PhysicsEngine

    /**
     * Crée un nouvel objet GLTF
     * @param type Type d'objet GLTF
     */
    constructor(protected type: GLTFObjectType) {
        this.gltfLoader = GLTFLoader.getInstance()
        this.mesh = new THREE.Group()
        this.physicsEngine = new PhysicsEngine()
    }

    /**
     * Charge un modèle à partir d'un fichier GLTF
     * @param url URL du fichier GLTF
     * @param options Options de chargement
     */
    public async loadFromGLTF(url: string, options?: Partial<GLTFLoadOptions>): Promise<void> {
        const defaultOptions: GLTFLoadOptions = {
            type: this.type,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1),
            addToScene: true,
            addToPhysics: false
        }

        const finalOptions = { ...defaultOptions, ...options }

        try {
            // Attendre l'initialisation du moteur physique
            await this.physicsEngine.waitForInit()
            console.log('Physics engine initialized for', this.type)

            const model = await this.gltfLoader.loadModel(url, finalOptions)

            // Remplacer le mesh par le modèle chargé
            this.mesh.clear()
            this.mesh.add(model)

            // Traiter les animations si présentes
            if (model.animations && model.animations.length > 0) {
                this.setupAnimations(model)
            }

            // Traiter la physique si nécessaire
            if (finalOptions.addToPhysics) {
                this.setupPhysics(finalOptions.mass || 1, finalOptions.lockRotation || false)
            }
        } catch (error) {
            console.error(`Erreur lors du chargement du modèle: ${url}`, error)
            throw error
        }
    }

    /**
     * Configure les animations du modèle
     * @param model Modèle avec animations
     * @protected
     */
    protected setupAnimations(model: THREE.Group): void {
        this.animations = model.animations
        this.mixer = new THREE.AnimationMixer(model)
    }

    /**
     * Configure la physique du modèle
     * @param mass Masse de l'objet
     * @param lockRotation Si la rotation doit être verrouillée
     * @protected
     */
    protected setupPhysics(mass: number, lockRotation: boolean): void {
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

    /**
     * Joue une animation
     * @param name Nom de l'animation
     * @param loop Si l'animation doit être en boucle
     */
    public playAnimation(name: string, loop: boolean = true): void {
        if (!this.mixer) return

        const clip = this.animations.find(a => a.name === name)
        if (!clip) {
            console.warn(`Animation "${name}" non trouvée`)
            return
        }

        if (this.currentAction) {
            this.currentAction.stop()
        }

        this.currentAction = this.mixer.clipAction(clip)
        this.currentAction.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, 0)
        this.currentAction.play()
    }

    /**
     * Arrête l'animation en cours
     */
    public stopAnimation(): void {
        if (this.currentAction) {
            this.currentAction.stop()
            this.currentAction = undefined
        }
    }

    /**
     * Met à jour l'objet
     * @param deltaTime Temps écoulé depuis la dernière mise à jour
     */
    public update(deltaTime: number): void {
        if (this.mixer) {
            this.mixer.update(deltaTime)
        }
    }

    /**
     * Récupère la position de l'objet
     */
    public getPosition(): THREE.Vector3 {
        return this.mesh.position
    }

    /**
     * Récupère le mesh de l'objet
     */
    public getMesh(): THREE.Group {
        return this.mesh
    }

    /**
     * Définit la position de l'objet
     * @param position Nouvelle position
     */
    public setPosition(position: THREE.Vector3): void {
        this.mesh.position.copy(position)
        if (this.physicsObject) {
            const rigidBody = this.physicsObject.getRigidBody()
            rigidBody.setTranslation(
                new RAPIER.Vector3(position.x, position.y, position.z),
                true
            )
        }
    }

    /**
     * Récupère la rotation de l'objet
     */
    public getRotation(): THREE.Euler {
        return this.mesh.rotation
    }

    /**
     * Définit la rotation de l'objet
     * @param rotation Nouvelle rotation
     */
    public setRotation(rotation: THREE.Euler): void {
        this.mesh.rotation.copy(rotation)
        if (this.physicsObject) {
            const rigidBody = this.physicsObject.getRigidBody()
            const quaternion = new THREE.Quaternion().setFromEuler(rotation)
            rigidBody.setRotation(
                new RAPIER.Quaternion(
                    quaternion.x,
                    quaternion.y,
                    quaternion.z,
                    quaternion.w
                ),
                true
            )
        }
    }
} 
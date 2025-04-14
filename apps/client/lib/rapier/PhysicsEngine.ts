import * as RAPIER from '@dimforge/rapier3d-compat';

export class PhysicsEngine {
    private world!: RAPIER.World;
    private gravity!: RAPIER.Vector3;
    private isInitialized = false;
    private initPromise: Promise<void>;

    constructor() {
        // Initialiser Rapier de manière asynchrone
        this.initPromise = this.initRapier();
    }

    private async initRapier() {
        try {
            console.log('Initializing Rapier physics engine...');
            await RAPIER.init();
            console.log('Rapier initialized successfully');

            this.gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
            this.world = new RAPIER.World(this.gravity);
            this.isInitialized = true;
            console.log('Physics world created with gravity:', this.gravity);
        } catch (error) {
            console.error('Failed to initialize Rapier:', error);
            throw error;
        }
    }

    /**
     * Attend que le moteur physique soit initialisé
     */
    public async waitForInit(): Promise<void> {
        await this.initPromise;
    }

    /**
     * Met à jour la simulation physique
     * @param deltaTime Le temps écoulé depuis la dernière mise à jour
     */
    public update(deltaTime: number): void {
        if (!this.isInitialized) {
            console.warn('Physics engine not initialized');
            return;
        }

        this.world.step();
    }

    /**
     * Ajoute un corps rigide au monde physique
     * @param position Position initiale
     * @param mass Masse du corps
     * @returns Le corps rigide créé
     */
    public addRigidBody(position: RAPIER.Vector3, mass: number): RAPIER.RigidBody {
        if (!this.isInitialized) {
            throw new Error('Physics engine not initialized');
        }

        console.log('Creating rigid body at position:', position, 'with mass:', mass);

        // Créer un corps rigide dynamique
        const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(position.x, position.y, position.z)
            .setLinearDamping(0.5) // Ajouter un peu de résistance au mouvement
            .setAngularDamping(0.5) // Ajouter un peu de résistance à la rotation

        const rigidBody = this.world.createRigidBody(rigidBodyDesc);
        console.log('Rigid body created successfully');

        // Ajouter une collider par défaut (une sphère)
        const colliderDesc = RAPIER.ColliderDesc.ball(1.0)
            .setFriction(0.7) // Ajouter de la friction
            .setRestitution(0.2) // Ajouter un peu de rebond
        this.world.createCollider(colliderDesc, rigidBody);
        console.log('Default collider added to rigid body');

        return rigidBody;
    }

    /**
     * Supprime un corps rigide du monde physique
     * @param rigidBody Le corps rigide à supprimer
     */
    public removeRigidBody(rigidBody: RAPIER.RigidBody): void {
        if (!this.isInitialized) {
            console.warn('Physics engine not initialized');
            return;
        }
        this.world.removeRigidBody(rigidBody);
    }

    /**
     * Récupère le monde physique
     */
    public getWorld(): RAPIER.World {
        if (!this.isInitialized) {
            throw new Error('Le monde physique n\'est pas encore initialisé');
        }
        return this.world;
    }
} 
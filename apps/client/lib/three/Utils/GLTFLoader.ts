import * as THREE from 'three'
import { GLTFLoader as ThreeGLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

/**
 * Type d'objet GLTF
 */
export enum GLTFObjectType {
    MAP = 'map',
    OBJECT = 'object',
    CHARACTER = 'character'
}

/**
 * Options pour le chargement GLTF
 */
export interface GLTFLoadOptions {
    /**
     * Type d'objet à charger
     */
    type: GLTFObjectType
    /**
     * Position initiale
     */
    position?: THREE.Vector3
    /**
     * Rotation initiale
     */
    rotation?: THREE.Euler
    /**
     * Échelle initiale
     */
    scale?: THREE.Vector3
    /**
     * Si l'objet doit être ajouté à la scène automatiquement
     */
    addToScene?: boolean
    /**
     * Si l'objet doit être ajouté à la physique
     */
    addToPhysics?: boolean
    /**
     * Masse de l'objet pour la physique (si addToPhysics est true)
     */
    mass?: number
    /**
     * Si la rotation doit être verrouillée pour la physique
     */
    lockRotation?: boolean
}

/**
 * Classe utilitaire pour charger des fichiers GLTF
 */
export class GLTFLoader {
    private loader: ThreeGLTFLoader
    private dracoLoader: DRACOLoader
    private static instance: GLTFLoader
    private loadedModels: Map<string, THREE.Group> = new Map()

    /**
     * Crée une instance du chargeur GLTF
     * @private
     */
    private constructor() {
        this.loader = new ThreeGLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('/draco/')
        this.loader.setDRACOLoader(this.dracoLoader)
    }

    /**
     * Récupère l'instance unique du chargeur GLTF
     */
    public static getInstance(): GLTFLoader {
        if (!GLTFLoader.instance) {
            GLTFLoader.instance = new GLTFLoader()
        }
        return GLTFLoader.instance
    }

    /**
     * Charge un modèle GLTF
     * @param url URL du modèle à charger
     * @param options Options de chargement
     * @returns Promesse résolue avec le modèle chargé
     */
    public async loadModel(url: string, options: GLTFLoadOptions): Promise<THREE.Group> {
        // Vérifier si le modèle est déjà chargé
        if (this.loadedModels.has(url)) {
            const model = this.loadedModels.get(url)!.clone()
            this.applyOptions(model, options)
            return model
        }

        try {
            console.log('Chargement du modèle GLTF:', url);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/octet-stream') && !contentType?.includes('model/gltf-binary')) {
                console.warn('Type de contenu inattendu:', contentType);
            }

            const arrayBuffer = await response.arrayBuffer();
            if (arrayBuffer.byteLength === 0) {
                throw new Error('Fichier vide reçu');
            }

            const gltf = await this.loader.loadAsync(url);
            const model = gltf.scene;

            // Appliquer les options
            this.applyOptions(model, options);

            // Stocker le modèle original pour le clonage futur
            this.loadedModels.set(url, model.clone());

            return model;
        } catch (error) {
            console.error('Erreur détaillée lors du chargement du modèle:', {
                url,
                error: error instanceof Error ? error.message : 'Erreur inconnue',
                stack: error instanceof Error ? error.stack : undefined
            });
            throw error;
        }
    }

    /**
     * Applique les options de chargement au modèle
     * @param model Modèle à modifier
     * @param options Options à appliquer
     * @private
     */
    private applyOptions(model: THREE.Group, options: GLTFLoadOptions): void {
        // Appliquer la position
        if (options.position) {
            model.position.copy(options.position)
        }

        // Appliquer la rotation
        if (options.rotation) {
            model.rotation.copy(options.rotation)
        }

        // Appliquer l'échelle
        if (options.scale) {
            model.scale.copy(options.scale)
        }

        // Traiter les animations si présentes
        if (model.animations && model.animations.length > 0) {
            // Les animations seront traitées dans les classes spécifiques
            // (Character, Object, etc.)
        }

        // Traiter les collisions si nécessaire
        if (options.addToPhysics) {
            // Les collisions seront traitées dans les classes spécifiques
            // (Character, Object, etc.)
        }
    }

    /**
     * Vérifie si un modèle est déjà chargé
     * @param url URL du modèle
     */
    public isModelLoaded(url: string): boolean {
        return this.loadedModels.has(url)
    }

    /**
     * Récupère un modèle déjà chargé
     * @param url URL du modèle
     */
    public getLoadedModel(url: string): THREE.Group | undefined {
        return this.loadedModels.get(url)
    }
} 
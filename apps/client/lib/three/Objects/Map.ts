import * as THREE from 'three'
import { GLTFLoader, GLTFObjectType } from '../Utils/GLTFLoader'
import type { GLTFLoadOptions } from '../Utils/GLTFLoader'

export class Map {
    public mesh: THREE.Group
    private gltfLoader: GLTFLoader

    constructor() {
        this.gltfLoader = GLTFLoader.getInstance()
        this.mesh = new THREE.Group()
        this.mesh.position.y = 0
    }

    /**
     * Charge une map à partir d'un fichier GLTF
     * @param url URL du fichier GLTF
     * @param options Options de chargement
     */
    public async loadFromGLTF(url: string, options?: Partial<GLTFLoadOptions>): Promise<void> {
        const defaultOptions: GLTFLoadOptions = {
            type: GLTFObjectType.MAP,
            position: new THREE.Vector3(0, 0, 0),
            rotation: new THREE.Euler(0, 0, 0),
            scale: new THREE.Vector3(1, 1, 1),
            addToScene: true,
            addToPhysics: false
        }

        const finalOptions = { ...defaultOptions, ...options }

        try {
            const model = await this.gltfLoader.loadModel(url, finalOptions)

            // Remplacer le mesh par le modèle chargé
            this.mesh.clear()
            this.mesh.add(model)

            // Appliquer la rotation de base pour que la map soit horizontale
            this.mesh.rotation.x = -Math.PI / 2
        } catch (error) {
            console.error(`Erreur lors du chargement de la map: ${url}`, error)
            throw error
        }
    }

    /**
     * Récupère la position de la map
     */
    public getPosition(): THREE.Vector3 {
        return this.mesh.position
    }

    /**
     * Définit la position de la map
     * @param position Nouvelle position
     */
    public setPosition(position: THREE.Vector3): void {
        this.mesh.position.copy(position)
    }
}

import * as THREE from 'three'
import { PhysicsEngine } from '../../rapier/PhysicsEngine'
import { Floor } from '../Objects/Floor'
import { Character } from '../Objects/Character'
import { CharacterController } from '../Controllers/CharacterController'
import { MainCamera } from '../Cameras/MainCamera'

export class SceneInitializer {
    constructor(
        private scene: THREE.Scene,
        private physicsEngine: PhysicsEngine,
        private container: HTMLElement
    ) { }

    async initialize(): Promise<{ floor: Floor; character: Character; characterController: CharacterController }> {
        const floor = new Floor(this.physicsEngine)
        this.scene.add(floor.getMesh())

        const character = new Character()
        await character.loadFromGLTF('/models/character.glb')
        this.scene.add(character.getMesh())

        const characterController = new CharacterController(character, new MainCamera(this.container), this.container)
        characterController.init()

        return { floor, character, characterController }
    }
} 
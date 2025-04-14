import { CharacterController } from '../Controllers/CharacterController'
import { MainRenderer } from '../Renderers/MainRenderer'
import { Character } from '../Objects/Character'
import { Floor } from '../Objects/Floor'

export class SceneCleanupManager {
    constructor(
        private characterController: CharacterController,
        private renderer: MainRenderer,
        private character: Character,
        private floor: Floor
    ) { }

    cleanup() {
        if (this.characterController) {
            this.characterController.cleanup()
        }
        if (this.renderer) {
            this.renderer.cleanup()
        }
        if (this.character && this.character.physicsObject) {
            this.character.physicsObject.dispose()
        }
        if (this.floor && this.floor.getPhysicsObject()) {
            this.floor.getPhysicsObject().dispose()
        }
    }
} 
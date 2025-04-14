import { PhysicsEngine } from '../../rapier/PhysicsEngine'
import { Character } from '../Objects/Character'
import { MainCamera } from '../Cameras/MainCamera'

export class SceneUpdater {
    constructor(
        private physicsEngine: PhysicsEngine,
        private character: Character,
        private mainCamera: MainCamera
    ) { }

    update(deltaTime: number) {
        const fixedDeltaTime = 1 / 60
        this.physicsEngine.update(fixedDeltaTime)

        if (this.character && this.character.canMove()) {
            this.character.update(deltaTime)

            const position = this.character.getPosition()
            if (position.distanceTo(this.mainCamera.getPosition()) > 0.01) {
                this.mainCamera.updatePosition(position)
            }
        }
    }
} 
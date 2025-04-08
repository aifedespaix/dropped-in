import * as THREE from 'three'
import { Cube } from '../Objects/Cube'
import { Door } from '../Objects/Door'
import { Map } from '../Objects/Map'
import { Character } from '../Objects/Character'
import { MainRenderer } from '../Renderers/MainRenderer'
import { MainCamera } from '../Cameras/MainCamera'
import { CharacterController } from '../Controllers/CharacterController'

export class MainScene {
    private scene: THREE.Scene
    private camera: MainCamera
    private renderer: MainRenderer
    private container: HTMLElement
    private cube: Cube
    private door: Door
    private map: Map
    private light: THREE.DirectionalLight
    private character: Character
    private characterController: CharacterController

    constructor(container: HTMLElement) {
        this.container = container
        this.scene = new THREE.Scene()
        this.camera = new MainCamera(this.container)
        this.renderer = new MainRenderer(this.container)
        this.cube = new Cube()
        this.door = new Door()
        this.map = new Map()
        this.light = new THREE.DirectionalLight(0xffffff, 1)
        this.character = new Character()
        this.characterController = new CharacterController(this.character)
    }

    init() {
        this.light.position.set(5, 10, 7.5)
        this.scene.add(this.light)

        this.scene.add(this.cube.mesh)
        this.scene.add(this.door.mesh)
        this.scene.add(this.map.mesh)

        this.scene.add(this.character.mesh)
    }

    animate = () => {
        requestAnimationFrame(this.animate)

        this.cube.update()
        this.door.update()
        this.characterController.update()

        const charPos = this.characterController.getPosition()
        const rotationMatrix = this.character.getRotationMatrix()

        this.camera.updatePosition(charPos)
        this.camera.updateRotation(rotationMatrix)

        this.renderer.render(this.scene, this.camera.getCamera())
    }

    cleanup() {
        this.characterController.cleanup()
        this.renderer.cleanup()
    }
}

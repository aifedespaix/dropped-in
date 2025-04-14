import * as THREE from 'three'

export class MainCamera {
    private camera: THREE.PerspectiveCamera
    private container: HTMLElement

    constructor(container: HTMLElement) {
        this.container = container
        this.camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        )
        this.init()
    }

    private init() {
        this.camera.position.set(0, 5, 10)
        this.camera.lookAt(0, 0, 0)
    }

    public updatePosition(position: THREE.Vector3) {
        this.camera.position.copy(position)
        this.camera.position.y += 1.5 // Offset pour la hauteur des yeux
    }

    public updateRotation(rotationMatrix: THREE.Matrix4) {
        this.camera.quaternion.setFromRotationMatrix(rotationMatrix)
    }

    public resize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera
    }

    public getPosition(): THREE.Vector3 {
        return this.camera.position.clone()
    }
} 
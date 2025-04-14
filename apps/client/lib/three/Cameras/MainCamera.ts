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

    public setRotation(horizontalRotation: number, verticalRotation: number) {
        // Créer les quaternions de rotation
        const horizontalQuaternion = new THREE.Quaternion()
        horizontalQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), horizontalRotation)

        const verticalQuaternion = new THREE.Quaternion()
        verticalQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), verticalRotation)

        // Combiner les rotations (d'abord horizontale, puis verticale)
        this.camera.quaternion.multiplyQuaternions(horizontalQuaternion, verticalQuaternion)

        // Forcer la mise à jour des matrices
        this.camera.updateMatrix()
        this.camera.updateMatrixWorld(true)

        // Forcer la mise à jour de la matrice de vue
        this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert()
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
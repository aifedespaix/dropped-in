import * as THREE from 'three'

export class Door {
    public mesh: THREE.Mesh

    constructor() {
        const geometry = new THREE.BoxGeometry(1, 2, 0.2)
        const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.x = 2
    }

    update() {
        this.mesh.rotation.y += 0.005
    }
}

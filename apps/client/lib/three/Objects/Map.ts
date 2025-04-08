import * as THREE from 'three'

export class Map {
    public mesh: THREE.Mesh

    constructor() {
        const geometry = new THREE.PlaneGeometry(20, 20)
        const material = new THREE.MeshStandardMaterial({ color: 0x808080 })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.rotation.x = -Math.PI / 2
    }
}

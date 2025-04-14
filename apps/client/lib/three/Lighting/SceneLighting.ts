import * as THREE from 'three'

export class SceneLighting {
    private light: THREE.DirectionalLight
    private ambientLight: THREE.AmbientLight

    constructor() {
        this.light = new THREE.DirectionalLight(0xffffff, 1)
        this.ambientLight = new THREE.AmbientLight(0x404040, 2)
    }

    setup(scene: THREE.Scene) {
        this.light.position.set(5, 10, 7.5)
        this.light.castShadow = true
        scene.add(this.light)
        scene.add(this.ambientLight)
    }
} 
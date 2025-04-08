import * as THREE from 'three'

export class MainRenderer {
    private renderer: THREE.WebGLRenderer
    private container: HTMLElement
    private handleResize: () => void

    constructor(container: HTMLElement) {
        this.container = container
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.handleResize = this.resize.bind(this)
        this.init()
    }

    private init() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.container.appendChild(this.renderer.domElement)
        window.addEventListener('resize', this.handleResize)
    }

    public render(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
        this.renderer.render(scene, camera)
    }

    public resize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    }

    public cleanup() {
        window.removeEventListener('resize', this.handleResize)
        this.renderer.dispose()
        this.container.removeChild(this.renderer.domElement)
    }
} 
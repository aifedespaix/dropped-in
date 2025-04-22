import { _Component } from '../_Component';
import * as THREE from 'three';
import { ThreeRenderService } from '../../services/ThreeRenderService';
export abstract class _RenderComponent extends _Component {
    public abstract getObject3D(): THREE.Object3D | null;
    public abstract render(): void;
    protected renderService: ThreeRenderService;

    constructor(renderService: ThreeRenderService) {
        super();
        this.renderService = renderService;
    }
}

import {
    MeshBasicMaterial,
    MeshStandardMaterial,
    MeshPhysicalMaterial,
    MeshPhongMaterial,
    Material
} from "three";

export type MaterialType = 'basic' | 'standard' | 'physical' | 'phong';

export class MaterialFactory {
    static create(materialType: MaterialType, color: number, options?: any): Material {
        const commonOptions = { color, ...options };

        switch (materialType) {
            case 'basic':
                return new MeshBasicMaterial(commonOptions);
            case 'standard':
                return new MeshStandardMaterial(commonOptions);
            case 'physical':
                return new MeshPhysicalMaterial(commonOptions);
            case 'phong':
                return new MeshPhongMaterial(commonOptions);
            default:
                throw new Error(`Unknown material type: ${materialType}`);
        }
    }
}

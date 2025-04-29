import type { InputAction } from "../InputBindings";

export interface _Input {
    update?(): void;
    isActionActive(action: InputAction): boolean;
    dispose?(): void;
    getLookInput?(): { x: number; y: number };
}


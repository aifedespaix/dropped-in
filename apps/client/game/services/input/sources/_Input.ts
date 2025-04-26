import type { InputAction } from "~/game/types/InputBinding";

export interface _Input {
    update?(): void;
    isActionActive(action: InputAction): boolean;
    dispose?(): void;
}

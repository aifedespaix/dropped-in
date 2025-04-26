export type InputAction = "moveForward" | "moveBackward" | "moveLeft" | "moveRight" | "jump" | "toggleTorch";
export type InputKey = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "Space" | "KeyF" | "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

export interface InputBinding {
    keys: InputKey[];
    continuous: boolean;
}

export const DEFAULT_INPUT_BINDINGS: Record<InputAction, InputBinding> = {
    moveForward: { keys: ["KeyW", "ArrowUp"], continuous: true },
    moveBackward: { keys: ["KeyS", "ArrowDown"], continuous: true },
    moveLeft: { keys: ["KeyA", "ArrowLeft"], continuous: true },
    moveRight: { keys: ["KeyD", "ArrowRight"], continuous: true },
    jump: { keys: ["Space"], continuous: false },
    toggleTorch: { keys: ["KeyF"], continuous: false },
};

import type { InputAction } from '../types/InputActions';
import type { InputKey } from '../types/InputKeys';
import { _Service } from './_Service';

type MouseButton = 'Mouse0' | 'Mouse1' | 'Mouse2';

export class InputService extends _Service {
    private keyStates: Map<InputKey | MouseButton, boolean> = new Map();
    private previousKeyStates: Map<InputKey | MouseButton, boolean> = new Map();
    private bindings: Map<InputAction, InputKey | MouseButton> = new Map();

    private mouseMovementX: number = 0;
    private mouseMovementY: number = 0;
    private mouseDeltaX: number = 0;
    private mouseDeltaY: number = 0;

    private onKeyDown = (event: KeyboardEvent): void => {
        const key = event.code as InputKey;
        this.keyStates.set(key, true);
    };

    private onKeyUp = (event: KeyboardEvent): void => {
        const key = event.code as InputKey;
        this.keyStates.set(key, false);
    };

    private onMouseDown = (event: MouseEvent): void => {
        const button = `Mouse${event.button}` as MouseButton;
        this.keyStates.set(button, true);
    };

    private onMouseUp = (event: MouseEvent): void => {
        const button = `Mouse${event.button}` as MouseButton;
        this.keyStates.set(button, false);
    };

    private onMouseMove = (event: MouseEvent): void => {
        this.mouseMovementX += event.movementX;
        this.mouseMovementY += event.movementY;
    };

    override init(): Promise<void> {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('mousedown', this.onMouseDown);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousemove', this.onMouseMove);

        // Bindings par défaut
        this.bind("moveForward", "KeyW");
        this.bind("moveBackward", "KeyS");
        this.bind("moveLeft", "KeyA");
        this.bind("moveRight", "KeyD");
        this.bind("jump", "Space");
        this.bind("attack", "Mouse0");

        return Promise.resolve()
    }

    update(dt: number): void {
        this.previousKeyStates = new Map(this.keyStates);

        this.mouseDeltaX = this.mouseMovementX;
        this.mouseDeltaY = this.mouseMovementY;

        this.mouseMovementX = 0;
        this.mouseMovementY = 0;
    }

    isPressed(action: InputAction): boolean {
        const key = this.bindings.get(action);
        return key ? this.keyStates.get(key) === true : false;
    }

    wasJustPressed(action: InputAction): boolean {
        const key = this.bindings.get(action);
        if (!key) return false;

        const current = this.keyStates.get(key);
        const previous = this.previousKeyStates.get(key);

        return current === true && previous !== true;
    }

    bind(action: InputAction, key: InputKey | MouseButton): void {
        this.bindings.set(action, key);
    }

    unbind(action: InputAction): void {
        this.bindings.delete(action);
    }

    getRawKeyState(key: InputKey | MouseButton): boolean {
        return this.keyStates.get(key) || false;
    }

    getMousePosition(): { x: number; y: number } {
        return { x: this.mouseMovementX, y: this.mouseMovementY };
    }

    getMouseDelta(): { dx: number; dy: number } {
        return { dx: this.mouseDeltaX, dy: this.mouseDeltaY };
    }

    destroy(): void {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('mousedown', this.onMouseDown);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousemove', this.onMouseMove);
    }
}

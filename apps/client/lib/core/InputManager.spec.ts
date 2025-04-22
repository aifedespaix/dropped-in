import { describe, it, expect, beforeEach } from 'vitest';
import { InputManager } from '../core/InputManager';
import type { InputAction } from '../types/InputActions';
import type { InputKey } from '../types/InputKeys';

describe('InputManager', () => {
    let input: InputManager;

    beforeEach(() => {
        input = InputManager.getInstance();
        input['keyStates'].clear();
        input['previousKeyStates'].clear();
        (input as any)['bindings'].clear();
    });

    it('binds and checks key mapping', () => {
        input.bind('jump', 'Space');
        expect((input as any)['bindings'].get('jump')).toBe('Space');
    });

    it('unbinds correctly', () => {
        input.bind('attack', 'Mouse0');
        input.unbind('attack');
        expect((input as any)['bindings'].has('attack')).toBe(false);
    });

    it('isPressed returns true only when key is down', () => {
        input.bind('jump', 'Space');
        input['keyStates'].set('Space', true);
        expect(input.isPressed('jump')).toBe(true);
        input['keyStates'].set('Space', false);
        expect(input.isPressed('jump')).toBe(false);
    });
    it('wasJustPressed returns true only on transition', () => {
        input.bind('jump', 'Space');

        input['keyStates'].set('Space', false);
        input.update(0.016);

        input['keyStates'].set('Space', true);
        expect(input.wasJustPressed('jump')).toBe(true);

        // simulate next frame
        input.update(0.016);
        expect(input.wasJustPressed('jump')).toBe(false);
    });

    it('getRawKeyState returns correct key state', () => {
        input['keyStates'].set('KeyW', true);
        expect(input.getRawKeyState('KeyW')).toBe(true);
        input['keyStates'].set('KeyW', false);
        expect(input.getRawKeyState('KeyW')).toBe(false);
    });
});

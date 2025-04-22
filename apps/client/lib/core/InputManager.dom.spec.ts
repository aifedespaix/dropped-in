import { describe, it, expect, beforeEach } from 'vitest';
import { InputManager } from './InputManager'; // adapte le chemin si besoin

describe('InputManager DOM events', () => {
    let input: InputManager;

    beforeEach(() => {
        input = InputManager.getInstance();
        input['keyStates'].clear();
        input['previousKeyStates'].clear();
        (input as any)['bindings'].clear();

        input.init(); // important pour attacher les event listeners
    });

    it('registers keydown event correctly', () => {
        input.bind('jump', 'Space');

        const keydownEvent = new KeyboardEvent('keydown', { code: 'Space' });
        window.dispatchEvent(keydownEvent);

        expect(input.getRawKeyState('Space')).toBe(true);
        expect(input.isPressed('jump')).toBe(true);
    });

    it('registers keyup event correctly', () => {
        input.bind('jump', 'Space');

        const keydown = new KeyboardEvent('keydown', { code: 'Space' });
        window.dispatchEvent(keydown);
        expect(input.isPressed('jump')).toBe(true);

        const keyup = new KeyboardEvent('keyup', { code: 'Space' });
        window.dispatchEvent(keyup);
        expect(input.getRawKeyState('Space')).toBe(false);
        expect(input.isPressed('jump')).toBe(false);
    });

    it('detects wasJustPressed correctly with DOM events', () => {
        input.bind('jump', 'Space');

        // Frame 1: simulate previous state (released)
        input['keyStates'].set('Space', false);
        input.update(0);

        // Frame 2: simulate press
        const keydown = new KeyboardEvent('keydown', { code: 'Space' });
        window.dispatchEvent(keydown);

        expect(input.wasJustPressed('jump')).toBe(true);

        // Frame 3: simulate held
        input.update(0);
        expect(input.wasJustPressed('jump')).toBe(false);
    });
});

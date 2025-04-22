import { _Component } from './_Component';
import { InputManager } from '../core/InputManager';
import type { InputInstantAction } from '../types/InputActions';
import type { _Action } from '../actions/_Action';
import { JumpAction } from '../actions/JumpAction';
import { AttackAction } from '../actions/AttackAction';
import { ActionManager } from '../core/ActionManager';
import { Vector3 } from 'three';
import { MovementControllerComponent } from './logic/MovementControllerComponent';

export class InputComponent extends _Component {
    private inputActionMap: Record<InputInstantAction, () => _Action> = {
        jump: () => new JumpAction(),
        attack: () => new AttackAction(),
    };

    override update(dt: number): void {
        const input = InputManager.getInstance();
        const actionManager = ActionManager.getInstance();

        this.updateInstantActions(input, actionManager);
        this.updateDirection(input);
    }

    updateInstantActions(input: InputManager, actionManager: ActionManager): void {
        for (const key in this.inputActionMap) {
            const actionKey = key as InputInstantAction;
            if (input.isPressed(actionKey)) {
                const action = this.inputActionMap[actionKey]();
                actionManager.perform(this.entity!, action);
            }
        }
    }

    updateDirection(input: InputManager): void {
        const dir = new Vector3();

        if (input.isPressed('moveForward')) dir.z -= 1;
        if (input.isPressed('moveBackward')) dir.z += 1;
        if (input.isPressed('moveLeft')) dir.x -= 1;
        if (input.isPressed('moveRight')) dir.x += 1;

        dir.normalize();

        const movement = this.entity?.tryGetComponent(MovementControllerComponent);
        if (movement) {
            movement.setDirection(dir);
        }
    }
}

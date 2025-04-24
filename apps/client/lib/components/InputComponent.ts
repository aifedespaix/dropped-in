import { _Component } from './_Component';
import type { InputInstantAction } from '../types/InputActions';
import type { _Action } from '../actions/_Action';
import { JumpAction } from '../actions/JumpAction';
import { AttackAction } from '../actions/AttackAction';
import { ActionManager } from '../core/ActionManager';
import { Vector3 } from 'three';
import { InputService } from '../services/InputService';
import type { ServiceLocator } from '../services/ServiceLocator';

export class InputComponent extends _Component {
    private inputService: InputService;
    private actionManager: ActionManager;
    private direction = new Vector3(0, 0, 0);


    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
        this.inputService = serviceLocator.get('input');
        this.actionManager = ActionManager.getInstance();
    }

    private inputActionMap: Record<InputInstantAction, () => _Action> = {
        jump: () => new JumpAction(),
        attack: () => new AttackAction(),
    };

    override update(dt: number): void {
        this._updateInstantActions();
        this._updateDirection();
    }

    private _updateInstantActions(): void {
        for (const key in this.inputActionMap) {
            const actionKey = key as InputInstantAction;
            if (this.inputService.isPressed(actionKey)) {
                const action = this.inputActionMap[actionKey]();
                this.actionManager.perform(this.entity!, action);
            }
        }
    }

    private _updateDirection(): void {
        this.direction.set(0, 0, 0);

        if (this.inputService.isPressed('moveForward')) this.direction.z -= 1;
        if (this.inputService.isPressed('moveBackward')) this.direction.z += 1;
        if (this.inputService.isPressed('moveLeft')) this.direction.x -= 1;
        if (this.inputService.isPressed('moveRight')) this.direction.x += 1;

        this.direction.normalize();
    }

    getDirection(): { x: number; z: number } {
        return { x: this.direction.x, z: this.direction.z };
    }

}

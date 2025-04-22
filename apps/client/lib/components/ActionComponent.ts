// components/ActionComponent.ts
import { _Component } from './_Component';
import { _Action } from '../actions/_Action';

export class ActionComponent extends _Component {
    private currentAction: _Action | null = null;

    perform(action: _Action) {
        if (this.currentAction?.isBlocking()) return;
        this.currentAction = action;
        action.start(this.entity!);
    }

    override update(dt: number) {
        this.currentAction?.update?.(dt);
        if (this.currentAction?.isComplete?.()) {
            this.currentAction.end?.();
            this.currentAction = null;
        }
    }
}

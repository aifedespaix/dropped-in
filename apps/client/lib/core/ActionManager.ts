import type { _Entity } from '../entities/_Entity';
import type { _Action } from '../actions/_Action';

export class ActionManager {
    private static _instance: ActionManager;

    // Map<EntityId, Map<channel, Action>>
    private activeActions: Map<number, Map<string, _Action>> = new Map();

    private constructor() { }

    static getInstance(): ActionManager {
        if (!this._instance) {
            this._instance = new ActionManager();
        }
        return this._instance;
    }

    perform(entity: _Entity, action: _Action): boolean {
        const entityId = entity.getId();
        const channel = action.getChannel();

        if (!this.activeActions.has(entityId)) {
            this.activeActions.set(entityId, new Map());
        }

        const channelMap = this.activeActions.get(entityId)!;

        const current = channelMap.get(channel);
        if (current && current.isBlocking()) {
            return false; // Une action bloquante est déjà en cours sur ce channel
        }

        action.start(entity);
        channelMap.set(channel, action);
        return true;
    }

    update(dt: number): void {
        for (const [entityId, actions] of this.activeActions.entries()) {
            for (const [channel, action] of actions.entries()) {
                action.update?.(dt);

                if (action.isComplete()) {
                    action.end?.();
                    actions.delete(channel);
                }
            }
        }
    }

    cancel(entity: _Entity, channel?: string): void {
        const entityActions = this.activeActions.get(entity.getId());
        if (!entityActions) return;

        if (channel) {
            const action = entityActions.get(channel);
            action?.end?.();
            entityActions.delete(channel);
        } else {
            // Cancel all actions for this entity
            for (const action of entityActions.values()) {
                action.end?.();
            }
            entityActions.clear();
        }
    }

    getAction(entity: _Entity, channel: string): _Action | null {
        return this.activeActions.get(entity.getId())?.get(channel) ?? null;
    }
}

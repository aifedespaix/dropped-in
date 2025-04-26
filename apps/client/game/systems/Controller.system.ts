import { PlayerFlagComponent } from "../components/declarative/PlayerFlag.component";
import type { _Entity } from "../entities/_Entity";
import { _System } from "./_System";

export class ControllerSystem extends _System {

    protected entityFilter(entity: _Entity): boolean {
        return entity.hasComponent(PlayerFlagComponent);
    }

    protected updateEntity(entity: _Entity, _delta: number): void {
    }
}


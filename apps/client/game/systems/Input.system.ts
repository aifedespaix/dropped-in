import { _System } from "./_System";
import { _Entity } from "../entities/_Entity";
import { InputComponent } from "../components/system/Input.component";
import type { ServiceLocator } from "../core/ServiceLocator";
import { ComponentSource } from "../components/_Component";
import { PlayerFlagComponent } from "../components/declarative/PlayerFlag.component";

export class InputSystem extends _System {
    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    protected entityFilter(entity: _Entity): boolean {
        return entity.hasComponent(PlayerFlagComponent);
    }

    protected override onEntityAdded(entity: _Entity): void {
        entity.addComponentSafe(new InputComponent(this.serviceLocator.get("input")), ComponentSource.System);
    }

    protected updateEntity(entity: _Entity, _delta: number): void {
    }

}

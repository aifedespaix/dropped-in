import { _System } from "./_System";
import { Entity } from "../entities/Entity";
import { InputComponent } from "../components/system/Input.component";
import type { ServiceLocator } from "../core/ServiceLocator";
import { ComponentSource } from "../components/_Component";
import { PlayerFlagComponent } from "../components/declarative/PlayerFlag.component";

export class InputSystem extends _System {
    constructor(serviceLocator: ServiceLocator) {
        super(serviceLocator);
    }

    protected override entityFilter(entity: Entity): boolean {
        return entity.hasComponent(PlayerFlagComponent);
    }

    protected override onEntityAdded(entity: Entity): void {
        entity.addComponentSafe(new InputComponent(this.serviceLocator.get("input")), ComponentSource.System);
    }

}

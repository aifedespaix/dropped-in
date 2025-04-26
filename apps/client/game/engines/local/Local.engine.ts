import type { _Entity } from "~/game/entities/_Entity";
import { _Engine } from "../_Engine";

export class LocalEngine extends _Engine {
    public load(): Promise<void> {
        return Promise.resolve();
    }

    public start(): void {
    }

    public update(): void {
    }

    protected entityFilter(_entity: _Entity): boolean {
        return true;
    }

    protected onEntityAdded(_entity: _Entity): void {
    }

}
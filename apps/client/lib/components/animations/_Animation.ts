import { _Component } from "../_Component";

export abstract class _Animation extends _Component {
    abstract override update(dt: number): void;
}
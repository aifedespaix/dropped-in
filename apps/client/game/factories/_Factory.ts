import { Entity } from "../entities/Entity";
import { _Component, ComponentSource } from "../components/_Component";

export type FactoryMethod<T> = Record<string, () => T>;

export class _Factory<T> {
}

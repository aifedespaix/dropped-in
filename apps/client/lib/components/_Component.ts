// core/Component.ts

import type { _Entity } from '../entities/_Entity';

export abstract class _Component {
    entity!: _Entity;

    start?(): void;
    init?(): Promise<void>;
    update?(dt: number): void;
    destroy?(): void;
}

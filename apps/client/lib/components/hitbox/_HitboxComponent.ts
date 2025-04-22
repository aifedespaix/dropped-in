import { _Component } from '../_Component';
import * as RAPIER from '@dimforge/rapier3d-compat';

export abstract class _HitboxComponent extends _Component {
    abstract getColliderDesc(): RAPIER.ColliderDesc;
}

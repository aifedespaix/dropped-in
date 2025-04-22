import type { _Entity } from '../entities/_Entity';
import type { ServiceLocator } from '../services/ServiceLocator';

/**
 * Un composant est un objet qui possède une logique.
 * Un composant est lié à une entité.
 * La logique d'un composant est exécutée dans le contexte de l'entité.
 */
export abstract class _Component {
    protected serviceLocator: ServiceLocator;
    entity!: _Entity;

    constructor(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    start?(): void;
    init?(): Promise<void>;
    update?(dt: number): void;
    destroy?(): void;
}

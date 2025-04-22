import type { _Entity } from '../entities/_Entity';

/**
 * Un système est un composant qui exécute une logique sur un ensemble d'entités.
 * Il est utilisé pour gérer les collisions, les animations, les déplacements, etc.
 * 
 * Deux entités interagissent ensemble ? Utiliser un système.
 * Les systèmes sont indépendants les uns des autres.
 */
export abstract class _System {
    abstract update(dt: number, entities: _Entity[]): void;

    // Optionnel : pour initialiser avec le monde ou d'autres services
    init?(entities: _Entity[]): void;

    // Optionnel : nettoyage ou retrait
    destroy?(): void;

    // Si besoin : filtrer les entités dès le départ
    filter?(entities: _Entity[]): _Entity[];
}

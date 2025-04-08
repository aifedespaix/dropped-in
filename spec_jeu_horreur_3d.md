
# SPEC-1: Jeu d'horreur 3D coopératif en ligne

## Background

L’objectif est de développer un jeu d’horreur en ligne en 3D, jouable directement depuis un navigateur. Le joueur évolue en vue à la première personne (FPS) dans un univers immersif. Le moteur de rendu utilisé est Three.js. Le jeu doit permettre à plusieurs joueurs d’interagir en ligne, avec un backend temps réel basé sur NestJS pour gérer les connexions et la logique serveur. Une simulation physique cohérente (collisions, mouvements, détections) est nécessaire pour renforcer l’immersion.

## Requirements

### Must Have
- Rendu 3D immersif en vue à la première personne via Three.js.
- Mode coopératif multijoueur (1 à 4 joueurs).
- Communication réseau temps réel entre clients et serveur (WebSockets).
- Simulation physique côté client (collisions, interactions).
- Gestion des connexions via NestJS côté serveur.
- Synchronisation des positions et actions des joueurs.

### Should Have
- Détection de collisions entre joueurs et environnement.
- Système de latence compensée pour les interactions réseau.
- Système d’entités partagées (ex : portes, objets à ramasser).
- Gestion des déconnexions/reconnexions.

### Could Have
- Système de voix intégrée ou chat textuel.
- Environnements destructibles ou interactifs.
- Intelligence artificielle d’ennemis.

### Won’t Have (pour l’instant)
- Matchmaking automatisé à grande échelle.
- Persistent world ou sauvegarde intersessions.

## Method

### Moteur Physique

Le moteur de physique côté client sera **Rapier.js**, un moteur moderne écrit en Rust et compilé en WebAssembly, offrant d’excellentes performances pour le navigateur.

Il sera utilisé pour :
- Gérer les collisions solides (mur, objets, sol).
- Appliquer des forces (sauts, poussées).
- Calculer les interactions dynamiques de l’environnement.

Chaque entité du jeu possédera :
- Une représentation graphique (`Three.js Mesh`).
- Une représentation physique (`Rapier RigidBody + Collider`).

La simulation s’exécute dans une boucle de rendu synchronisée avec Three.js.

### Architecture Réseau & Backend

L’architecture réseau s’appuie sur une logique **client-serveur**. Le serveur, développé avec **NestJS**, gère les connexions des joueurs via WebSockets et synchronise les états de la partie.

#### Synchronisation

- Le serveur agit comme un relai autoritaire léger.
- Les clients gèrent leur propre physique localement (Rapier).
- Les positions et actions des joueurs sont envoyées périodiquement (ex. 20 Hz).
- Le serveur diffuse ces mises à jour aux autres clients.

#### Messages WebSocket

```json
{
  "type": "player_move",
  "id": "player1",
  "position": { "x": 10, "y": 0, "z": 5 },
  "rotation": { "x": 0, "y": 1, "z": 0, "w": 0 }
}
```

#### Room Management

Chaque session multijoueur est encapsulée dans une **room isolée**, avec :
- Une liste de joueurs connectés.
- Un identifiant de partie.
- Un état partagé (inventaire commun, portes ouvertes, ennemis activés).

### Gestion des données (stateless pour MVP)

Toutes les structures sont maintenues en mémoire côté serveur. Lors d’une reconnexion ou d’un redémarrage, les données sont perdues.

#### Préparation à la persistence

Les entités sont organisées en modèles sérialisables (JSON), prêtes à être mappées à une base (PostgreSQL, MongoDB, etc.).

## Implementation

### Étape 1 – Initialisation client
- Setup Three.js + Rapier
- Contrôleur joueur + collisions
- Liaison physics ↔ rendu

### Étape 2 – Serveur NestJS
- Setup WebSocket Gateway
- Création rooms, gestion connexions

### Étape 3 – Synchro réseau
- Envoi/écoute des updates
- Affichage avatars distants

### Étape 4 – Scène de jeu
- Niveau simple + interactions
- Sons + ambiance

### Étape 5 – UI minimale
- Formulaire de pseudo + lobby
- Debug console

### Étape 6 – Tests
- Multiclient sur réseau
- Réglage fréquence updates

## Milestones

### Semaine 1 – Prototype local
- Déplacement joueur + collisions
- Affichage d’une scène simple

### Semaine 2 – Serveur de jeu
- NestJS + WebSocket
- Rooms et connexions

### Semaine 3 – Multijoueur
- Synchronisation avatars
- Déconnexions stables

### Semaine 4 – Environnement
- Objets interactifs
- Sons + ambiance

### Semaine 5 – MVP finalisé
- Interface minimale
- Tests de stabilité

### Semaine 6 – Préparation future
- Modélisation entités
- Transition vers stockage

## Gathering Results

### Fonctionnalité
- Mouvement 3D avec collisions
- Coop 1–4 joueurs, synchronisation temps réel

### Performance
- Latence < 100ms
- 60 FPS en moyenne
- Taille de build raisonnable

### Robustesse
- Connexions stables
- Aucun crash
- Physique fiable

### Retours utilisateurs
- Tests sur groupe restreint
- Feedback sur l’ambiance et le gameplay

### Préparation à l’itération
- Modules clairs
- Code structuré
- APIs prêtes à évoluer

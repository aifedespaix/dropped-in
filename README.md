# 🌟 Game Engine

> Un moteur de jeu 3D pour navigateur — modulaire, orienté objet, flexible et ultra-performant.

---

## 🎯 Objectifs

Ce projet a pour ambition de créer un moteur de jeu 3D moderne pour le web, basé sur :

- **TypeScript** pour une architecture solide et typée.
- **Three.js** pour le rendu graphique 3D.
- **Rapier (WebAssembly)** pour une physique réaliste et performante.
- **Architecture ECS** (Entity-Component-System) propre et scalable.
- **Synchronisation fine** entre les mondes physique et graphique.
- **Modularité maximale** grâce à un design orienté composants et systèmes.

---

## 🛠️ Stack technique

- **Client** : Nuxt 3 + UnoCSS + Three.js
- **Serveur** : NestJS
- **Moteur physique** : Rapier3D (via WebAssembly)
- **Monorepo** : géré par Bun.js
- **Langage principal** : TypeScript
- **Architecture** :
  - `apps/` : client et serveur
  - `packages/` : modules moteur partagés (core, physique, composants, systèmes, types, etc.)

---

## ✨ Fonctionnalités principales

- **Moteur 3D** basé sur Three.js avec intégration personnalisée de Rapier.
- **Composants physiques** (rigid bodies, colliders, hitbox).
- **Systèmes physiques** pour orchestrer l'initialisation, la simulation et les interactions.
- **Support multijoueur** avec NestJS (temps réel via WebSockets).
- **Synchronisation précise** entre Rapier et Three.js (position, rotation).
- **Composants orientés architecture ECS** (_Component, _System, etc.).
- **Gestion avancée de la caméra** (FPS, TPS, aérienne).
- **Service Locator** pour l'injection de dépendances internes.

---

## 📦 Installation

```bash
# Clone du projet
git clone https://github.com/ton-utilisateur/game-engine.git
cd game-engine

# Installation des dépendances
bun install

# Lancer le client et le serveur en mode développement
bun run client:dev
bun run server:dev
ou
bun run dev # Run en dual

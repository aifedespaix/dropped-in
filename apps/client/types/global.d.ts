import { PhysicsEngine } from '~/lib/rapier/PhysicsEngine';

declare global {
    interface Window {
        physicsEngine: PhysicsEngine;
    }
} 
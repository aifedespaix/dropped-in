import type { RapierPhysicsService } from "./RapierPhysicsService";
import type { ThreeRenderService } from "./ThreeRenderService";
import type { InputService } from "./InputService";
import type { _Service } from "./_Service";

export type ServiceMap = {
    render: ThreeRenderService;
    physics: RapierPhysicsService;
    input: InputService;
    // audio: AudioService;
};

export type ServiceKey = keyof ServiceMap;

/**
 * ServiceLocator permet d'accéder aux services de manière globale.
 * 
 * Il est utilisé pour partager des services entre les composants et les systèmes.
 * Un service est utilisé à de multiples endroits ? Utiliser un ServiceLocator.
 */
export class ServiceLocator {
    private services = new Map<ServiceKey, _Service>();

    register<K extends ServiceKey>(key: K, service: ServiceMap[K]) {
        this.services.set(key, service);
    }

    get<K extends ServiceKey>(key: K): ServiceMap[K] {
        return this.services.get(key) as ServiceMap[K];
    }
}


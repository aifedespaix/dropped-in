import type { InputService } from "../services/Input.service";
import type { _Service } from "../services/_Service";
import type { ResourceService } from "../services/Resource.service";

export type ServiceMap = {
    input: InputService;
    resource: ResourceService;
};

export type ServiceKey = keyof ServiceMap;


export class ServiceLocator {
    readonly #services = new Map<ServiceKey, _Service>();

    register<K extends ServiceKey>(key: K, service: ServiceMap[K]) {
        this.#services.set(key, service);
    }

    get<K extends ServiceKey>(key: K): ServiceMap[K] {
        const service = this.#services.get(key);
        if (!service) {
            throw new Error(`Le service "${key}" n'est pas enregistré.`);
        }
        return service as ServiceMap[K];
    }
}

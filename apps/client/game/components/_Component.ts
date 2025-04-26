export enum ComponentType {
    Runtime = "Runtime",
    Declarative = "Declarative",
}

export enum ComponentSource {
    Factory = "Factory",
    Engine = "Engine",
    System = "System",
}

export abstract class _Component {
    readonly type: ComponentType;

    constructor(type: ComponentType) {
        this.type = type;
    }
}

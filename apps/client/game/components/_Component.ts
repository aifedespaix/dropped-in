export enum ComponentType {
    Runtime = "Runtime",
    Declarative = "Declarative",
}

export enum ComponentSource {
    Factory = "Factory",
    System = "System",
}

export abstract class _Component {
    readonly type: ComponentType;

    constructor(type: ComponentType) {
        this.type = type;
    }
}

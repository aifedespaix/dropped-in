import { _Component } from '../_Component';

export abstract class IRenderComponent extends _Component {
    abstract initModel(): void;
    abstract render(): void;
}

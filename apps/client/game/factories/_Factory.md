```ts
import { type FactoryMethod } from "./_Factory";

export class EntityFactory implements FactoryMethod<Type> {
    [key: string]: () => Type;

    xxx(): Type => {

    }
}
```
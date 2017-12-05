// Should be declared only once per application
import "reflect-metadata";
import { Container, inject, interfaces } from "inversify";
import { autoProvide, makeProvideDecorator, makeFluentProvideDecorator } from "inversify-binding-decorators";


let container = new Container();

let provide = makeProvideDecorator(container);
let fluentProvider = makeFluentProvideDecorator(container);

let provideNamed = (identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>,
                    name: string) => {
    return fluentProvider(identifier)
        .whenTargetNamed(name)
        .done();
};

let provideSingleton = (identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => {
    return fluentProvider(identifier)
        .inSingletonScope()
        .done();
};

export { container, autoProvide, provide, provideSingleton, provideNamed, inject };

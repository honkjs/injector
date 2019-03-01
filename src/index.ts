import { IHonkMiddlewareCreator, IHonk } from '@honkjs/honk';

declare module '@honkjs/honk' {
  interface IHonk {
    /**
     * Runs the specified action, injecting any honk services into it,
     * and returning the results.
     *
     * @template T The return value type.  May be void.
     * @param {(services: any) => T} action A function that accepts services.
     * @returns {T} Any results from the action function.
     */
    <T>(action: (services: any) => T): T;
  }
}

/**
 * The default services shared by honk injector.
 */
export interface IHonkServices {
  honk: IHonk;
  [key: string]: any;
}

/**
 * Creates a middleware to add injector to honk.
 * @param services An object literal containing additional services to be injected
 */
export default function createMiddleware(services = {}): IHonkMiddlewareCreator {
  return (app, next) => {
    // sanity check for existing services
    if (app.services && typeof app.services !== 'object') {
      throw new Error('app.services is already defined by previous middleware and is not an object.  Modify existing middleware to set services to an object literal {} if it needs to be shared.');
    }

    // create the default services with honk, any existing, and the passed in services.
    app.services = {
      honk: app.honk,
      ...app.services,
      ...services,
    };

    return (args) => {
      // one argument of type function = call it, passing in services
      if (args.length === 1 && typeof args[0] === 'function') {
        return args[0](app.services);
      }
      return next(args);
    };
  };
}

<div>
  <!-- npm -->
  <a href="https://www.npmjs.com/package/@honkjs/injector">
    <img src="https://img.shields.io/npm/v/@honkjs/injector.svg?style=flat-square" alt="npm version" />
  </a>
  <!--  dependencies -->
  <a href="https://david-dm.org/honkjs/injector">
    <img src="https://david-dm.org/honkjs/injector.svg?style=flat-square" alt="dependency status" />
  </a>
  <!-- dev dependencies  -->
  <a href="https://david-dm.org/honkjs/injector&type=dev">
    <img src="https://david-dm.org/honkjs/injector/dev-status.svg?style=flat-square" alt="dev dependency status" />
  </a>
  <!-- greenkeeper -->
  <a href="https://greenkeeper.io/">
    <img src="https://badges.greenkeeper.io/honkjs/injector.svg" alt="greenkeeper status" />
  </a>
  <!-- coverage -->
  <a href="https://codecov.io/github/honkjs/injector">
    <img src="https://img.shields.io/codecov/c/github/honkjs/injector/master.svg?style=flat-square" alt="test coverage" />
  </a>
  <!-- build -->
  <a href="https://travis-ci.org/honkjs/injector">
    <img src="https://img.shields.io/travis/honkjs/injector/master.svg?style=flat-square" alt="build status" />
  </a>
</div>

# honkjs/injector

Injects services into functions passed to honk. Very similar functionality to [redux-thunk](https://github.com/reduxjs/redux-thunk).

```js
import Honk from '@honkjs/honk';
import injector from '@honkjs/injector';
import api from 'mycoolapi';

const honk = new Honk()
  // add injector to the middleware pipeline
  .use(injector({ api })).honk;

function getSomething(name) {
  return function({ api }) {
    // returns a promise
    return api.fetchSomething(name);
  };
}

honk(getSomething('bob')).then((results) => console.log(results));
```

Injector always returns the results of the function passed in.

"Dependency injection" is handled using js object deconstruction.

```js
// no deconstruction
function boringThunk(name) {
  return function(services) {
    return services.api.getSomething(name);
  };
}

// deconstructed
function coolThunk(name) {
  return function({ api }) {
    return api.getSomething(name);
  };
}

honk(boringThunk('Bob'));
honk(coolThunk('George'));
```

There is no dependency resolution, or anything fancy like that. Injector is built with the simple goal of allowing you to easily access application services from anywhere honk is available.

# Type safety

If you're using typescript, you likely want some type safety on the services object. There are a couple ways to achieve this. Which way you use is totally a matter of preference.

## Union type

```ts
type MyHonkAppServices = {
  api: MyApi;
} & IHonkServices;

// this creates a new type combining the IHonkServices with your own
// { api: MyApi, honk: IHonk }

function coolThunk(name) {
  return function({ api }: MyHonkAppServices) {
    return api.getSomething(name);
  };
}
```

## Declaration merging

Similar to how IHonk can be overloaded, you can use declaration merging.

```ts
declare module '@honkjs/injector' {
  interface IHonkServices {
    api: MyApi;
  }
}

// The standard IHonkServices type will now be:
// { api: MyApi, honk: IHonk }

function coolThunk(name) {
  return function({ api }: IHonkServices) {
    return api.getSomething(name);
  };
}
```

## Manually

```ts
type MyHonkAppServices = {
  honk: IHonk;
  api: MyApi;
}

function coolThunk(name) {
  return function({ api }: MyHonkAppServices) {
    return api.getSomething(name);
  };
}
```

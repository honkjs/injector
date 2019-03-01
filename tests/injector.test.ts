import 'jest';
import Honk from '@honkjs/honk';
import injector from '../src';

test('still honks', () => {
  console.log = jest.fn();

  const honk = new Honk().use(injector()).honk;

  expect(honk()).toBeUndefined();
  expect(console.log).toBeCalledWith('HONK 🚚 HONK');
});

test('calls function', () => {
  console.log = jest.fn();

  let value = 0;
  function test() {
    value++;
  }

  const honk = new Honk().use(injector()).honk;

  expect(honk(test)).toBeUndefined();
  expect(value).toBe(1);
  expect(console.log).not.toBeCalled();
});

test('returns function results', () => {
  console.log = jest.fn();

  function test() {
    return 'test';
  }

  const honk = new Honk().use(injector()).honk;

  expect(honk(test)).toBe('test');
  expect(console.log).not.toBeCalled();
});

test('injects services', () => {
  console.log = jest.fn();

  function test(services: any) {
    expect(typeof services.honk).toBe('function');
    return 'test';
  }

  const honk = new Honk().use(injector()).honk;

  expect(honk(test)).toBe('test');
  expect(console.log).not.toBeCalled();
});

test('injects custom services', () => {
  console.log = jest.fn();

  function test(services: any) {
    expect(typeof services.honk).toBe('function');
    expect(services.test).toBe('data');
    return 'test';
  }

  const honk = new Honk().use(injector({ test: 'data' })).honk;

  expect(honk(test)).toBe('test');
  expect(console.log).not.toBeCalled();
});

test('keeps existing services', () => {
  console.log = jest.fn();

  function test(services: any) {
    expect(typeof services.honk).toBe('function');
    expect(services.test).toBe('data');
    expect(services.existing).toBe('data2');
    return 'test';
  }

  const honk = new Honk()
    .use((app, next) => {
      app.services = { existing: 'data2' };
      return next;
    })
    .use(injector({ test: 'data' })).honk;

  expect(honk(test)).toBe('test');
  expect(console.log).not.toBeCalled();
});

test('checks existing services', () => {
  const honk = new Honk().use((app, next) => {
    const garbage: any = 'ahoy';
    // intentionally break services
    app.services = garbage;
    return next;
  });

  // should throw if it's invalid
  expect(() => honk.use(injector({ test: 'data' }))).toThrow();
});

test('works with no previous services', () => {
  console.log = jest.fn();

  function test(services: any) {
    expect(typeof services.honk).toBe('function');
    expect(services.test).toBe('data');
    return 'test';
  }

  const honk = new Honk()
    .use((app, next) => {
      const garbage: any = undefined;
      // this would be the default in honk 2.0
      app.services = garbage;
      return next;
    })
    .use(injector({ test: 'data' })).honk;

  expect(honk(test)).toBe('test');
  expect(console.log).not.toBeCalled();
});

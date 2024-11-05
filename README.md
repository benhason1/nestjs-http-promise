# `nestjs-http-promise`

[![npm version](https://img.shields.io/npm/v/nestjs-http-promise.svg?style=flat-square)](https://www.npmjs.org/package/nestjs-http-promise)
[![npm downloads](https://img.shields.io/npm/dm/nestjs-http-promise.svg?style=flat-square)](http://npm-stat.com/charts.html?package=nestjs-http-promise)

A promise-based implementation of `@nestjs/axios` with retries without needing
to mess around with `rxjs`'s `Observable` data structures.

## Features

- Axios
  - The most used package for HTTP requests in npm and the one used by NestJS's
    official HTTP library.
- Promise-based
  - Most uses of `@nestjs/axios` just call `.toPromise()` on every HTTP call to
    exit out of the `rxjs` `Observable` data structure without leveraging it
    any further.
- Retries
  - Leverages `axios-retry` to provide retries out of box with promises.

## Quick start

### Installing

Using npm:

```
$ npm install nestjs-http-promise
```

Using yarn:

```
$ yarn add nestjs-http-promise
```

### Usage - just like every nest.js module

Import the module:

```ts
import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';

@Module({
  imports: [HttpModule],
  provide: [MyService],
})
export class MyModule {}
```

Inject the service in the class and use it:

```ts
import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';

@Injectable()
class MyService {
  constructor(private readonly httpService: HttpService) {}

  public callSomeServer(): Promise<object> {
    return this.httpService.get('http://fakeService');
  }
}
```

## Configuration

The service uses `axios` and `axios-retry` and their configurations can be
provided via the module's options via `HttpModule.register` or
`HttpModule.registerAsync` just like with all other NestJS modules.

### Synchronous register example

```ts
import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';

@Module({
  imports: [
    HttpModule.register({
      axiosConfig: {
        // AxiosRequestConfig same as you would pass to `Axios.create({ ... })`
        // https://github.com/axios/axios#request-config
      },
      axiosRetryConfig: {
        // IAxiosRetryConfig same as you would pass to `axiosRetry(axios, { ... })`
        // https://github.com/softonic/axios-retry#options
      },
      interceptors: {
        // See interceptors documentation below
      },
    }),
  ],
})
export class MyModule {}
```

### Asynchronous register example

```ts
import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: ['SOMETHING_FROM_GLOBAL_FOR_EXAMPLE'],
      useFactory: (somethingGlobalForExample: Record<string, string>) => ({
        axiosConfig: {
          // AxiosRequestConfig same as you would pass to `Axios.create({ ... })`
        },
        axiosRetryConfig: {
          // IAxiosRetryConfig same as you would pass to `axiosRetry(axios, { ... })`
          retries: Number(somethingGlobalForExample.retries),
        },
        interceptors: {
          // See interceptors documentation below
        },
      }),
    }),
  ],
})
export class MyModule {}
```

Refer to NestJS's documentation for more advanced async module instantiation.

### Registering Axios interceptors

This module supports optionally configuring Axios interceptors via module
configuration.

```ts
import { Module } from '@nestjs/common';
import { HttpModule } from 'nestjs-http-promise';

@Module({
  imports: [
    HttpModule.register({
      interceptors: {
        request: {
          onFulfilled: (requestConfig: InternalAxiosRequestConfig) => {
            // Custom logic here

            return requestConfig;
          },
          onRejected: (error: any) => {
            // Custom logic here

            return error;
          },
          options: {},
        },

        response: {
          onFulfilled: (response: AxiosResponse) => {
            // Custom logic here

            return response;
          },
          onRejected: (error: any) => {
            // Custom logic here

            return error;
          },
          options: {},
        },
      },
    }),
  ],
})
export class MyModule {}
```

The equivalent implementation when using Axios directly would be this:

```ts
import { Axios } from 'axios';

const client = Axios.create();

client.interceptors.request.use(
  (requestConfig: InternalAxiosRequestConfig) => {
    // Custom logic here

    return requestConfig;
  },
  (error: any) => {
    // Custom logic here

    return error;
  },
  {},
);

client.interceptors.response.use(
  (response: AxiosResponse) => {
    // Custom logic here

    return response;
  },
  (error: any) => {
    // Custom logic here

    return error;
  },
  {},
);
```

You can also interact with the Axios interceptors after construction via the
`axiosRef` on the HTTP service:

```ts
import { Injectable } from '@nestjs/common';
import { HttpService } from 'nestjs-http-promise';

@Injectable()
class MyService {
  constructor(private readonly httpService: HttpService) {}

  public doThing() {
    this.httpService.axiosRef.interceptors.request.use(requestConfig => {
      // Custom logic here

      return requestConfig;
    });
  }
}
```

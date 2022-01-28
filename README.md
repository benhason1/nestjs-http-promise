# nestjs-http-promise
[![npm version](https://img.shields.io/npm/v/nestjs-http-promise.svg?style=flat-square)](https://www.npmjs.org/package/nestjs-http-promise)
[![npm downloads](https://img.shields.io/npm/dm/nestjs-http-promise.svg?style=flat-square)](http://npm-stat.com/charts.html?package=nestjs-http-promise)

## description
nestjs module that just doing little modification to the original and good **nestjs** http module.


## features
  * axios - the most used package for http requests in npm and the one used by nestjs official http library.
    * better axios stack trace - axios has an [open issue](https://github.com/axios/axios/issues/2387) about improvement of their stack trace. 
      in this library there is a default interceptor that will intercept the stack trace and will add data to it.
  * promise based - most of us using the current http module that uses observable which we don't use most of the time 
    and in order to avoid it were just calling `.toPromise()` every http call.
  * retries - in many cases we will want to retry a failing http call.
    with observable we could just add the retry operator (rxjs) but with promises we need to implement this logic ourselves.
    this package will make it easy for you, just pass `{ retries: NUMBER_OF_RETRIES }` in the config of the http module.
    **more details in the configuration section**
    
## quick start 
### installing
Using npm:
```
$ npm install nestjs-http-promise
```

Using yarn:
```
$ yarn add nestjs-http-promise
```

### usage - just like every nest.js module
  import the module:
  ```ts
import { HttpModule } from 'nestjs-http-promise'

@Module({ 
    imports: [HttpModule]
})
```

inject the service in the class:
```ts
import { HttpService } from 'nestjs-http-promise'

class Demo {
    constructor(private readonly httpService: HttpService) {}
}
```

use the service:
```ts
public callSomeServer(): Promise<object> {
  return this.httpService.get('http://fakeService') 
}
```

## configuration

the service uses axios and axios-retry, so you can pass any [AxiosRequestConfig](https://github.com/axios/axios#request-config)
And/Or [AxiosRetryConfig](https://github.com/softonic/axios-retry#options)

just pass it in the `.register()` method as you would do in the original nestjs httpModule
```ts
import { HttpModule } from 'nestjs-http-promise'

@Module({
  imports: [HttpModule.register(
    {
      timeout: 1000,
      retries: 5,
        ...
    }
  )]
})
```

### default configuration
 * default config of axios-retry : https://github.com/softonic/axios-retry#options
 * better axios stack trace is added by default, you can turn it off by passing the **isBetterStackTraceEnabled** to false.

## async configuration
When you need to pass module options asynchronously instead of statically, use the `registerAsync()` method **just like in nest httpModule**.

you have a couple of techniques to do it:
* with the useFactory
```ts
HttpModule.registerAsync({
    useFactory: () => ({
    timeout: 1000,
    retries: 5,
      ...
    }),
});
```

* using class
 
```ts
HttpModule.registerAsync({
  useClass: HttpConfigService,
});
```
Note that in this example, the HttpConfigService has to implement HttpModuleOptionsFactory interface as shown below.
```ts
@Injectable()
class HttpConfigService implements HttpModuleOptionsFactory {
  async createHttpOptions(): Promise<HttpModuleOptions> {
    const configurationData = await someAsyncMethod();
    return {
      timeout: configurationData.timeout,
      retries: 5,
        ...
    };
  }
}
```
If you want to reuse an existing options provider instead of creating a copy inside the HttpModule, 
use the useExisting syntax.
```ts
HttpModule.registerAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```

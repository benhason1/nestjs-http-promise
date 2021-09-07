# nestjs-http-promise

## description
nestjs module that just doing little modification to the original and good **nestjs** http module.


## features
  * axios - the most used package for http requests in npm.
  * promise based - most of us using the current http module and on every call do `.toPromise()`
    because most of the time we do not need the features of observable.
  * retries - one of the powerful features of observable is its ability to do in very simple way,
    you can do it by just adding the retry operator, this package will provide you the same feature even in easier way,
    just pass `{ retries: NUMBER_OF_RETRIES }` in the config of the http module.
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
 just the default config of axios-retry : https://github.com/softonic/axios-retry#options

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
    const configurationData = await sonmeAsyncMethod();
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

import {
  Module,
  ConfigurableModuleBuilder,
  DynamicModule,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

import Axios from 'axios';
import axiosRetry from 'axios-retry';

import { AXIOS_INSTANCE_TOKEN, HTTP_MODULE_ID } from './http.constants';
import { HttpService } from './http.service';
import { HttpModuleOptions } from './interfaces';

const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<HttpModuleOptions>({
    moduleName: 'HttpModule',
    optionsInjectionToken: 'HTTP_MODULE_OPTIONS_TOKEN',
  }).build();

@Module({
  providers: [
    HttpService,
    {
      provide: AXIOS_INSTANCE_TOKEN,
      inject: [{ token: MODULE_OPTIONS_TOKEN, optional: true }],
      useFactory: (options: HttpModuleOptions = {}) => {
        const axiosInstance = Axios.create(options?.config);

        axiosRetry(axiosInstance, options?.config);

        if (options.interceptors?.request) {
          axiosInstance.interceptors.request.use(
            options.interceptors.request.onFulfilled,
            options.interceptors.request.onRejected,
            options.interceptors.request.options,
          );
        }

        if (options.interceptors?.response) {
          axiosInstance.interceptors.response.use(
            options.interceptors.response.onFulfilled,
            options.interceptors.response.onRejected,
            options.interceptors.response.options,
          );
        }

        return axiosInstance;
      },
    },
    {
      provide: HTTP_MODULE_ID,
      useValue: randomStringGenerator(),
    },
  ],
  exports: [HttpService],
})
export class HttpModule extends ConfigurableModuleClass {
  // Redefining the register static method to allow `undefined` options to be
  // accepted by the type system
  public static register(options?: HttpModuleOptions): DynamicModule {
    return super.register(options);
  }
}

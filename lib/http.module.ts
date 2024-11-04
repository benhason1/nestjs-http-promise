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
  new ConfigurableModuleBuilder<HttpModuleOptions>().build();

@Module({
  providers: [
    HttpService,
    {
      provide: AXIOS_INSTANCE_TOKEN,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: HttpModuleOptions) => {
        const axiosInstance = Axios.create(options);
        axiosRetry(axiosInstance, options);
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

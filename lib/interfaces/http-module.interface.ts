import type {
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';

export type HttpModuleOptions = {
  config?: AxiosRequestConfig & IAxiosRetryConfig;

  interceptors?: {
    response?: {
      onFulfilled?: (
        value: AxiosResponse,
      ) => AxiosResponse | Promise<AxiosResponse>;
      onRejected?: (error: any) => any;
      options?: AxiosInterceptorOptions;
    };
    request?: {
      onFulfilled?: (
        value: InternalAxiosRequestConfig,
      ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
      onRejected?: (error: any) => any;
      options?: AxiosInterceptorOptions;
    };
  };
};

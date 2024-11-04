import type {
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';

export type HttpModuleOptions = {
  axiosConfig?: AxiosRequestConfig;

  interceptors?: {
    request?: {
      onFulfilled?: (
        value: InternalAxiosRequestConfig,
      ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
      onRejected?: (error: any) => any;
      options?: AxiosInterceptorOptions;
    };
    response?: {
      onFulfilled?: (
        value: AxiosResponse,
      ) => AxiosResponse | Promise<AxiosResponse>;
      onRejected?: (error: any) => any;
      options?: AxiosInterceptorOptions;
    };
  };

  axiosRetryConfig?: IAxiosRetryConfig;
};

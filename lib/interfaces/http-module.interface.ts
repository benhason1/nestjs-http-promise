import { AxiosRequestConfig } from 'axios';
import { IAxiosRetryConfig } from 'axios-retry';

export type HttpModuleOptions = AxiosRequestConfig & IAxiosRetryConfig;

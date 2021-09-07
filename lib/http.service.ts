import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import Axios ,{AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AXIOS_INSTANCE_TOKEN } from "./http.constants";

@Injectable()
export class HttpService {
    constructor(
        @Inject(AXIOS_INSTANCE_TOKEN)
        private readonly instance: AxiosInstance = Axios,
    ) {}
    request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.request(config)
    }
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.get(url, config);
    }
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.delete(url, config);
    }
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.head(url, config);
    }
    post<T = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.post(url, data, config);
    }
    put<T = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.put(url, data, config);
    }
    patch<T = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.instance.patch(url, data, config);
    }

    get axiosRef(): AxiosInstance {
        return this.instance
    }
}

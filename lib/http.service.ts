import { Injectable, Inject } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import { AXIOS_INSTANCE_TOKEN } from './http.constants';

@Injectable()
export class HttpService {
  public readonly put: typeof Axios.put;
  public readonly post: typeof Axios.post;
  public readonly patch: typeof Axios.patch;
  public readonly head: typeof Axios.patch;
  public readonly delete: typeof Axios.delete;
  public readonly get: typeof Axios.get;
  public readonly request: typeof Axios.request;

  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN)
    private readonly instance: AxiosInstance = Axios,
  ) {
    this.put = this.instance.put;
    this.post = this.instance.post;
    this.patch = this.instance.patch;
    this.head = this.instance.head;
    this.head = this.instance.head;
    this.delete = this.instance.delete;
    this.get = this.instance.get;
    this.request = this.instance.request;
  }

  get axiosRef(): AxiosInstance {
    return this.instance;
  }
}

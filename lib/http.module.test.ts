import { describe, it, expect, vitest } from 'vitest';
import { Test } from '@nestjs/testing';

import { HttpModule, HttpService } from './index';

describe('HttpModule', () => {
  it('should implicitly register', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule],
    }).compile();

    const httpService = moduleRef.get<HttpService>(HttpService);

    expect(httpService).toBeDefined();
  });

  it('should register synchronously', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HttpModule.register()],
    }).compile();

    const httpService = moduleRef.get<HttpService>(HttpService);

    expect(httpService).toBeDefined();
  });

  it('should register asynchronously', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        HttpModule.registerAsync({
          useFactory: () => {
            return {};
          },
        }),
      ],
    }).compile();

    const httpService = moduleRef.get<HttpService>(HttpService);

    expect(httpService).toBeDefined();
  });

  it('should register interceptors', async () => {
    const responseOnFulfilled = vitest.fn();
    const requestOnFulfilled = vitest.fn();

    const moduleRef = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          interceptors: {
            response: {
              onFulfilled: response => {
                responseOnFulfilled('response');

                return response;
              },
            },

            request: {
              onFulfilled: requestConfig => {
                requestOnFulfilled('request');

                return requestConfig;
              },
            },
          },
        }),
      ],
    }).compile();

    const httpService = moduleRef.get<HttpService>(HttpService);

    await httpService.get('https://github.com');

    expect(responseOnFulfilled).toHaveBeenCalledTimes(1);
    expect(responseOnFulfilled).toHaveBeenCalledWith('response');

    expect(requestOnFulfilled).toHaveBeenCalledTimes(1);
    expect(requestOnFulfilled).toHaveBeenCalledWith('request');
  });

  it('should async register interceptors', async () => {
    const responseOnFulfilled = vitest.fn();
    const requestOnFulfilled = vitest.fn();

    const moduleRef = await Test.createTestingModule({
      imports: [
        HttpModule.registerAsync({
          useFactory: () => ({
            interceptors: {
              response: {
                onFulfilled: response => {
                  responseOnFulfilled('response');

                  return response;
                },
              },

              request: {
                onFulfilled: requestConfig => {
                  requestOnFulfilled('request');

                  return requestConfig;
                },
              },
            },
          }),
        }),
      ],
    }).compile();

    const httpService = moduleRef.get<HttpService>(HttpService);

    await httpService.get('https://github.com');

    expect(responseOnFulfilled).toHaveBeenCalledTimes(1);
    expect(responseOnFulfilled).toHaveBeenCalledWith('response');

    expect(requestOnFulfilled).toHaveBeenCalledTimes(1);
    expect(requestOnFulfilled).toHaveBeenCalledWith('request');
  });
});

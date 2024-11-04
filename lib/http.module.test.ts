import { describe, it, expect } from 'vitest';
import { Test } from '@nestjs/testing';
import { HttpModule } from './http.module';
import { HttpService } from './http.service';

describe('HttpModule', () => {
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
});

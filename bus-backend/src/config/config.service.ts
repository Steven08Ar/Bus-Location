import { Injectable } from '@nestjs/common';
import { env, EnvConfig } from './env';

@Injectable()
export class ConfigService {
  private readonly config: EnvConfig = env;

  get<T extends keyof EnvConfig>(key: T): EnvConfig[T] {
    return this.config[key];
  }
}

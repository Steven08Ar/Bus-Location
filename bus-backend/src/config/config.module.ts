import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        APP_PORT: Joi.number().default(3000),
        MAPBOX_TOKEN: Joi.string().required(),
        MQTT_URL: Joi.string().uri().default('mqtt://localhost:1883'),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().default(5432),
        DB_USER: Joi.string().default('postgres'),
        DB_PASSWORD: Joi.string().default('1234'),
        DB_NAME: Joi.string().default('unibus'),
        // legacy names supported for compatibility
        POSTGRES_HOST: Joi.string().optional(),
        POSTGRES_PORT: Joi.number().optional(),
        POSTGRES_USER: Joi.string().optional(),
        POSTGRES_PASSWORD: Joi.string().optional(),
        POSTGRES_DB: Joi.string().optional(),
      }),
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}

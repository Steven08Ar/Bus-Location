import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') || config.get('POSTGRES_HOST') || 'localhost',
        port: config.get('DB_PORT') || config.get('POSTGRES_PORT') || 5432,
        username: config.get('DB_USER') || config.get('POSTGRES_USER') || 'postgres',
        password: config.get('DB_PASSWORD') || config.get('POSTGRES_PASSWORD') || '1234',
        database: config.get('DB_NAME') || config.get('POSTGRES_DB') || 'unibus',
        autoLoadEntities: true,
        synchronize: true, // disable in production
      }),
    }),
  ],
})
export class DatabaseModule {}

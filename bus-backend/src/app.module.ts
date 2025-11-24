import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { MapboxModule } from './mapbox/mapbox.module';
import { BusModule } from './bus/bus.module';
import { RoutesModule } from './routes/routes.module';
import { EtaModule } from './eta/eta.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule, DatabaseModule, MapboxModule, BusModule, RoutesModule, EtaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

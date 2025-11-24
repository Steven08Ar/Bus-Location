import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '../config/config.service';
import { BusService } from './bus.service';
import { LocationMessage } from './interfaces/location-message.interface';
import { handleServiceError } from '../utils/error-handler';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private readonly client: ClientProxy;

  constructor(
    private readonly configService: ConfigService,
    private readonly busService: BusService,
  ) {
    this.client = ClientProxyFactory.create({
      transport: Transport.MQTT,
      options: { url: this.configService.get('MQTT_URL') },
    });
  }

  async onModuleInit() {
    await this.bindListeners();
  }

  private async bindListeners() {
    const mqttClient: any = await this.client.connect();
    mqttClient.subscribe('bus/location', (err: Error) => {
      if (err) {
        this.logger.error(`MQTT subscription failed: ${err.message}`);
      } else {
        this.logger.log('Subscribed to bus/location');
      }
    });

    mqttClient.on('message', async (topic: string, payload: Buffer) => {
      if (topic !== 'bus/location') return;

      try {
        const message = JSON.parse(payload.toString()) as LocationMessage;
        await this.busService.saveLocation({
          busId: message.busId,
          lat: message.lat,
          lng: message.lng,
          speed: message.speed,
          timestamp: message.timestamp ? new Date(message.timestamp) : new Date(),
        });
      } catch (error) {
        handleServiceError(error, 'MQTT message handler');
      }
    });
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}

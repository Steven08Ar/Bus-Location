import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { BusService } from './bus.service';
import { LocationMessage } from './interfaces/location-message.interface';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { BusLocationPayloadDto } from './dto/bus-location-payload.dto';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client?: mqtt.MqttClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly busService: BusService,
  ) {}

  async onModuleInit() {
    const url = this.configService.get<string>('MQTT_URL') || 'mqtt://localhost:1883';
    this.client = mqtt.connect(url);

    this.client.on('connect', () => {
      this.logger.log(`Connected to MQTT broker at ${url}`);
      this.client?.subscribe('bus/location', (err) => {
        if (err) {
          this.logger.error(`MQTT subscription failed: ${err.message}`);
        } else {
          this.logger.log('Subscribed to bus/location');
        }
      });
    });

    this.client.on('message', async (topic: string, payload: Buffer) => {
      if (topic !== 'bus/location') return;
      try {
        const raw = JSON.parse(payload.toString());
        if (raw.id === null || raw.id === undefined) {
          this.logger.warn('Discarding invalid MQTT message: id is missing');
          return;
        }
        const parsed = { ...(raw as LocationMessage), id: String(raw.id) };
        const dto = plainToInstance(BusLocationPayloadDto, parsed);
        const errors = validateSync(dto, { whitelist: true, forbidNonWhitelisted: true });
        if (errors.length > 0) {
          this.logger.warn('Discarding invalid MQTT message: validation failed');
          return;
        }
        if (!this.busService.validateIncomingMqttData(dto)) {
          this.logger.warn('Discarding invalid MQTT message: missing required fields');
          return;
        }
        await this.busService.saveLocation({
          id: dto.id,
          lat: dto.lat,
          lng: dto.lng,
          speed: parsed.speed,
          timestamp: parsed.timestamp ? new Date(parsed.timestamp) : new Date(),
        });
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.error(`MQTT message handler error: ${msg}`);
      }
    });

    this.client.on('error', (err) => {
      this.logger.error(`MQTT client error: ${err.message}`);
    });
  }

  async onModuleDestroy() {
    if (this.client) {
      this.client.end(true, undefined, () => {
        this.logger.log('MQTT client disconnected');
      });
    }
  }
}

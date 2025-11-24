import * as dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  MAPBOX_TOKEN: string;
  MQTT_URL: string;
  PORT: number;
}

export const env: EnvConfig = {
  MAPBOX_TOKEN: process.env.MAPBOX_TOKEN || '',
  MQTT_URL: process.env.MQTT_URL || 'mqtt://localhost:1883',
  PORT: Number(process.env.PORT) || 3000,
};

export interface EnvironmentVariables {
  APP_PORT: number;
  MAPBOX_TOKEN: string;
  MQTT_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  POSTGRES_HOST?: string;
  POSTGRES_PORT?: number;
  POSTGRES_USER?: string;
  POSTGRES_PASSWORD?: string;
  POSTGRES_DB?: string;
}

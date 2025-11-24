export interface LocationMessage {
  busId: string;
  lat: number;
  lng: number;
  speed?: number;
  timestamp?: string | number | Date;
}

export interface BusLocationPayload {
  busId: string;
  lat: number;
  lng: number;
  speed?: number;
  timestamp: Date;
}

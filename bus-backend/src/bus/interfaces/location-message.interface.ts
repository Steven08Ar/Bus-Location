export interface LocationMessage {
  id: string;
  lat: number;
  lng: number;
  speed?: number;
  timestamp?: string | number | Date;
}

export interface BusLocationPayload {
  id: string;
  lat: number;
  lng: number;
  speed?: number;
  timestamp: Date;
}

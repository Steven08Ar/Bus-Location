import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BusLocationPayload } from './interfaces/location-message.interface';

@WebSocketGateway({ namespace: '/bus', cors: { origin: '*', credentials: true } })
export class BusGateway {
  @WebSocketServer()
  server: Server;

  broadcastLocation(payload: BusLocationPayload) {
    if (this.server) {
      this.server.emit('location_update', payload);
    }
  }
}

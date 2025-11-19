import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SensorGateway {
  @WebSocketServer()
  server: Server;

  broadcast(data: any) {
    this.server.emit('sensor-update', data);
  }
}

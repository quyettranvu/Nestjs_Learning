import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './user/services/auth.service';

@WebSocketGateway()
export class EventGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly authService: AuthService) {}

  //Server can self send messages to all user(new updates, notifications, etc)
  handleEmitSocket({ data, event, to }) {
    if (to) {
      // this.server.to(to.map((item) => String(item))).emit(event, data);
      this.server.to(to).emit(event, data);
    } else {
      this.server.emit(event, data);
    }
  }

  //Handle receiving and sending message to user connecting to server
  @SubscribeMessage('message')
  async handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    console.log('message', data, socket.id);
    setTimeout(() => {
      this.server.to(socket.data.email).emit('message', data);
    }, 1000);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  afterInit(socket: Socket): any {}

  async handleConnection(socket: Socket) {
    console.log('connect', socket.id);
    const authHeader = socket.handshake.headers.authorization; //handshake with the help of authToken
    if (authHeader && (authHeader as string).split(' ')[1]) {
      try {
        socket.data.email = await this.authService.handleVerifyToken(
          (authHeader as string).split(' ')[1],
        );

        //when a user connected, add to the list of socket
        socket.join(socket.data.email);
        console.log('This user connected successfully', socket.data.email);
      } catch (error) {
        socket.disconnect();
      }
    } else {
      socket.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('This user disconnected', socket.id, socket.data?.email);
  }
}

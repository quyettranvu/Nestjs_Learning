import {
  Controller,
  Inject,
  Get,
  Post,
  UseGuards,
  Req,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import SubscriberInterface from './subscriber.interface';

@Controller('subscriber')
export class SubscriberController implements OnModuleInit {
  private gRpcSerivce: SubscriberInterface;
  constructor(
    // @Inject('SUBSCRIBER_SERVICE')
    // private readonly subscriberService: ClientProxy,

    @Inject('SUBSCRIBER_SERVICE')
    private client: ClientGrpc,
  ) {}

  onModuleInit(): any {
    this.gRpcSerivce =
      this.client.getService<SubscriberInterface>('SubscriberService');
  }

  @Get()
  async getSubscribers() {
    return this.gRpcSerivce.getAllSubscribers({});
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any) {
    return this.gRpcSerivce.addSubscriber({
      email: req.user.email,
      name: req.user.name,
    });
  }
}

// /*TCP*/
// /*Message sent as request and hopes to receive response back*/
// @Get()
// @UseGuards(AuthGuard('jwt'))
// async getSubscriber() {
//   //system received requests from client, send to Microservices
//   return this.subscriberService.send(
//     {
//       cmd: 'get-all-subscriber',
//     },
//     {},
//   );
// }

// @Post()
// @UseGuards(AuthGuard('jwt'))
// async createSubscriber(@Req() req: any) {
//   return this.subscriberService.send(
//     {
//       cmd: 'add-subscriber',
//     },
//     req.user,
//   );
// }

// /*Event sent to EventPattern*/
// @Post('event')
// @UseGuards(AuthGuard('jwt'))
// async createSubscriberEvent(@Req() req: any) {
//   this.subscriberService.emit(
//     {
//       cmd: 'add-subscriber',
//     },
//     req.user,
//   );
//   return true;
// }

// /*RMq-send message to add new subscriber to Microservice*/
// @Post('rmq')
// @UseGuards(AuthGuard('jwt'))
// async createPost(@Req() req: any) {
//   return this.subscriberService.send(
//     {
//       cmd: 'add-subscriber',
//     },
//     req.user,
//   );
// }

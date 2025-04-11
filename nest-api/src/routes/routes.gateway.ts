import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Producer } from 'kafkajs';
import { Server, Socket } from 'socket.io';
import { Position } from './interfaces/position.interface';

@WebSocketGateway({
  cors: {
    origin: '*', // Em produção, você deve restringir isso para o domínio do seu frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'routes',
})
export class RoutesGateway
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  private kafkaProducer: Producer;

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('new-direction')
  async handleNewDirection(client: Socket, payload: { routeId: string }) {
    console.log(
      `New direction requested by ${client.id} for route ${payload.routeId}`,
    );

    await this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({
            routeId: payload.routeId,
            clientId: client.id,
          }),
        },
      ],
    });
  }

  sendPosition(data: Position) {
    console.log(
      `Enviando posição para clientes WebSocket: ${JSON.stringify(data)}`,
    );
    this.server.emit('new-position', data);
    console.log('Posição enviada com sucesso');
  }
}

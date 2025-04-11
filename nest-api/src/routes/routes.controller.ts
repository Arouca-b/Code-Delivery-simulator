import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { Position } from './interfaces/position.interface';

@Controller('routes')
export class RoutesController implements OnModuleInit {
  private kafkaProducer: Producer;

  constructor(
    private readonly routesService: RoutesService,
    @Inject('KAFKA_SERVICE')
    private kafkaClient: ClientKafka,
  ) {}

  @Post()
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Get()
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(+id, updateRouteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routesService.remove(+id);
  }

  @Get(':id/start')
  async startCorrida(@Param('id') id: string) {
    await this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({ routeId: id, ClientId: '' }),
        },
      ],
    });
    //enviar mensagem para o kafka
  }

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect();
  }

  @MessagePattern('route.new-position')
  consumeNewPosition(
    @Payload()
    message: {
      value?: any;
    },
  ) {
    console.log('\n\n\nRecebida nova posição\n\n');
    console.log('Mensagem completa:', JSON.stringify(message));

    try {
      // Verifica se a mensagem já é a posição ou se está dentro de uma propriedade value
      const positionData: Position = (
        message.value !== undefined ? message.value : message
      ) as Position;

      // Verifica se positionData tem as propriedades necessárias
      if (!positionData || !positionData.routeId || !positionData.position) {
        console.error('Dados de posição inválidos:', positionData);
        return;
      }

      // Encaminha a atualização de posição para os clientes WebSocket
      this.routesService.sendPosition(positionData);
    } catch (error) {
      console.error('Erro ao processar mensagem de posição:', error);
    }
  }
}

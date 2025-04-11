import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Route, RouteDocument } from './entities/route.entity';
import { Model } from 'mongoose';
import { RoutesGateway } from './routes.gateway';
import { Position } from './interfaces/position.interface';

@Injectable()
export class RoutesService {
  constructor(
    @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
    private routesGateway: RoutesGateway,
  ) {}

  create(createRouteDto: CreateRouteDto) {
    return 'This action adds a new route';
  }

  findAll() {
    return this.routeModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: number, updateRouteDto: UpdateRouteDto) {
    return `This action updates a #${id} route`;
  }

  remove(id: number) {
    return `This action removes a #${id} route`;
  }

  sendPosition(data: Position) {
    // Encaminha a atualização de posição para o gateway WebSocket
    this.routesGateway.sendPosition(data);
  }
}

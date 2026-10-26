import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Restaurante } from './restaurante.entity';
import { RestauranteService } from './restaurantes.service';
import { CreateRestauranteDto } from './create-restaurante.dto';

@Controller('restaurantes')
export class RestauranteController {
  constructor(private readonly service: RestauranteService) {}
  @Get() findAll(
    @Query() filtros: Record<string, string>,
  ): Promise<Restaurante[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Restaurante> {
    return this.service.findOne(id);
  }
  @Post() create(@Body() datos: CreateRestauranteDto): Promise<Restaurante> {
    return this.service.create(datos);
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<Restaurante>,
  ): Promise<Restaurante> {
    return this.service.update(id, datos);
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eliminado: boolean }> {
    return this.service.remove(id);
  }
}

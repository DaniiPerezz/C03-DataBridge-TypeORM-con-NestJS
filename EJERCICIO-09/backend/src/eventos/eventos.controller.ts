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
import { Evento } from './evento.entity';
import { EventoService } from './eventos.service';

@Controller('eventos')
export class EventoController {
  constructor(private readonly service: EventoService) {}
  @Get() findAll(@Query() filtros: Record<string, string>): Promise<Evento[]> {
    return this.service.findFiltered(filtros.ciudad, filtros.categoria);
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number): Promise<Evento> {
    return this.service.findOne(id);
  }
  @Post() create(@Body() datos: Partial<Evento>): Promise<Evento> {
    return this.service.create(datos);
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<Evento>,
  ): Promise<Evento> {
    return this.service.update(id, datos);
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eliminado: boolean }> {
    return this.service.remove(id);
  }
}

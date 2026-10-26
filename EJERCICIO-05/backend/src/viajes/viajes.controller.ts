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
import { Viaje } from './viaje.entity';
import { ViajeService } from './viajes.service';
import { UpdateViajeDto } from './update-viaje.dto';

@Controller('viajes')
export class ViajeController {
  constructor(private readonly service: ViajeService) {}
  @Get() findAll(@Query() filtros: Record<string, string>): Promise<Viaje[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number): Promise<Viaje> {
    return this.service.findOne(id);
  }
  @Post() create(@Body() datos: Partial<Viaje>): Promise<Viaje> {
    return this.service.create(datos);
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateViajeDto,
  ): Promise<Viaje> {
    return this.service.update(id, datos);
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eliminado: boolean }> {
    return this.service.remove(id);
  }
}

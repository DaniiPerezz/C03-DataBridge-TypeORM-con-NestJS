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
import { Mascota } from './mascota.entity';
import { MascotaService } from './mascotas.service';

@Controller('mascotas')
export class MascotaController {
  constructor(private readonly service: MascotaService) {}
  @Get() findAll(@Query() filtros: Record<string, string>): Promise<Mascota[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number): Promise<Mascota> {
    return this.service.findOne(id);
  }
  @Post() create(@Body() datos: Partial<Mascota>): Promise<Mascota> {
    return this.service.create(datos);
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<Mascota>,
  ): Promise<Mascota> {
    return this.service.update(id, datos);
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eliminado: boolean }> {
    return this.service.remove(id);
  }
}

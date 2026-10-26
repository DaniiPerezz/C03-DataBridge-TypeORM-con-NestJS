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
import { Destino } from './destino.entity';
import { DestinoService } from './destinos.service';
import { CreateDestinoDto } from './create-destino.dto';
import { UpdateDestinoDto } from './update-destino.dto';

@Controller('destinos')
export class DestinoController {
  constructor(private readonly service: DestinoService) {}
  @Get() findAll(@Query() filtros: Record<string, string>): Promise<Destino[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number): Promise<Destino> {
    return this.service.findOne(id);
  }
  @Post() create(@Body() datos: CreateDestinoDto): Promise<Destino> {
    return this.service.create(datos);
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: UpdateDestinoDto,
  ): Promise<Destino> {
    return this.service.update(id, datos);
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eliminado: boolean }> {
    return this.service.remove(id);
  }
}

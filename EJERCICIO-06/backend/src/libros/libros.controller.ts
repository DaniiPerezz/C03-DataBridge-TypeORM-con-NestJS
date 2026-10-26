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
import { Libro } from './libro.entity';
import { LibroService } from './libros.service';

@Controller('libros')
export class LibroController {
  constructor(private readonly service: LibroService) {}
  @Get() findAll(@Query() filtros: Record<string, string>): Promise<Libro[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
    return this.service.findOne(id);
  }
  @Patch(':id/leido') marcarLeido(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Libro> {
    return this.service.marcarLeido(id);
  }
  @Post() create(@Body() datos: Partial<Libro>): Promise<Libro> {
    return this.service.create(datos);
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<Libro>,
  ): Promise<Libro> {
    return this.service.update(id, datos);
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eliminado: boolean }> {
    return this.service.remove(id);
  }
}

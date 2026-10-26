import { Controller, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { Pelicula } from './pelicula.entity';
import { PeliculasService } from './peliculas.service';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly service: PeliculasService) {}

  @Get()
  findAll(): Promise<Pelicula[]> {
    return this.service.findAll();
  }

  @Patch(':id/favorita')
  cambiarFavorita(@Param('id', ParseIntPipe) id: number): Promise<Pelicula> {
    return this.service.cambiarFavorita(id);
  }
}

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
import { Playlist } from './playlist.entity';
import { PlaylistService } from './playlists.service';
import { Cancion } from './cancion.entity';

@Controller('playlists')
export class PlaylistController {
  constructor(private readonly service: PlaylistService) {}
  @Get() findAll(
    @Query() filtros: Record<string, string>,
  ): Promise<Playlist[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Playlist> {
    return this.service.findOne(id);
  }
  @Post(':id/canciones') addSong(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: { nombre: string; artista: string },
  ): Promise<Cancion> {
    return this.service.addSong(id, datos);
  }
  @Post() create(@Body() datos: Partial<Playlist>): Promise<Playlist> {
    return this.service.create(datos);
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<Playlist>,
  ): Promise<Playlist> {
    return this.service.update(id, datos);
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eliminado: boolean }> {
    return this.service.remove(id);
  }
}

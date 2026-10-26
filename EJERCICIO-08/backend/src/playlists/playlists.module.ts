import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { Cancion } from './cancion.entity';
import { PlaylistController } from './playlists.controller';
import { PlaylistService } from './playlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Cancion])],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}

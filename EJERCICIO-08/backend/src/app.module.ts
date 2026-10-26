import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistModule } from './playlists/playlists.module';

@Module({ imports: [TypeOrmModule.forRoot({ type: 'postgres', host: 'localhost', port: 5432, username: 'postgres', password: '1234', database: 'databridge_e08', autoLoadEntities: true, synchronize: true }), PlaylistModule] })
export class AppModule {}

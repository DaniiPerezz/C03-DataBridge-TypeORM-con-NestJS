import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity';
import { Cancion } from './cancion.entity';

@Injectable()
export class PlaylistService implements OnModuleInit {
  constructor(
    @InjectRepository(Playlist)
    private readonly repository: Repository<Playlist>,
    @InjectRepository(Cancion) private readonly canciones: Repository<Cancion>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({ nombre: 'Entrenamiento' }),
        this.repository.create({ nombre: 'Estudio' }),
      ]);
    }
  }

  findAll(): Promise<Playlist[]> {
    return this.repository.find({
      relations: { canciones: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Playlist> {
    const registro = await this.repository.findOne({
      where: { id },
      relations: { canciones: true },
    });
    if (!registro)
      throw new NotFoundException('No se ha encontrado el registro');
    return registro;
  }
  create(datos: Partial<Playlist>): Promise<Playlist> {
    return this.repository.save(this.repository.create(datos));
  }
  async addSong(
    id: number,
    datos: { nombre: string; artista: string },
  ): Promise<Cancion> {
    const playlist = await this.findOne(id);
    return this.canciones.save(this.canciones.create({ ...datos, playlist }));
  }
  async update(id: number, datos: Partial<Playlist>): Promise<Playlist> {
    const registro = await this.findOne(id);
    Object.assign(registro, datos);
    return this.repository.save(registro);
  }
  async remove(id: number): Promise<{ eliminado: boolean }> {
    const registro = await this.findOne(id);
    await this.repository.remove(registro);
    return { eliminado: true };
  }
}

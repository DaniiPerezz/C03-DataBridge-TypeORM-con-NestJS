import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from './pelicula.entity';

@Injectable()
export class PeliculasService implements OnModuleInit {
  constructor(
    @InjectRepository(Pelicula)
    private readonly repository: Repository<Pelicula>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          titulo: 'Interstellar',
          genero: 'Ciencia ficciÃ³n',
          anio: 2014,
          puntuacion: 9.2,
          favorito: true,
        }),
        this.repository.create({
          titulo: 'Coco',
          genero: 'AnimaciÃ³n',
          anio: 2017,
          puntuacion: 8.8,
          favorito: false,
        }),
      ]);
    }
  }

  findAll(): Promise<Pelicula[]> {
    return this.repository.find({ order: { puntuacion: 'DESC' } });
  }

  async cambiarFavorita(id: number): Promise<Pelicula> {
    const pelicula = await this.repository.findOneBy({ id });
    if (!pelicula)
      throw new NotFoundException('No se ha encontrado la pelÃ­cula');
    pelicula.favorito = !pelicula.favorito;
    return this.repository.save(pelicula);
  }
}

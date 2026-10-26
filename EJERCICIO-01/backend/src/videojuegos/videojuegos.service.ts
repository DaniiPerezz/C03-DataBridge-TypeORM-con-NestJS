// videojuegos.service.ts
// RESPONSABILIDAD:
// Trabajar con los datos mediante Repository<Videojuego>.

import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videojuego } from './videojuego.entity';

@Injectable()
export class VideojuegosService implements OnModuleInit {
  constructor(
    // NestJS inyecta el Repository que TypeORM ha creado
    // específicamente para la Entity Videojuego.
    @InjectRepository(Videojuego)
    private readonly repository: Repository<Videojuego>,
  ) {}

  // Solo para este primer ejercicio:
  // al arrancar añadimos ejemplos si la tabla está vacía.
  async onModuleInit(): Promise<void> {
    const iniciales = [
      {
        titulo: 'Hollow Knight',
        genero: 'Metroidvania',
        plataforma: 'Nintendo Switch',
        puntuacion: 9.4,
      },
      {
        titulo: 'Zelda: Tears of the Kingdom',
        genero: 'Aventura',
        plataforma: 'Nintendo Switch',
        puntuacion: 9.8,
      },
      {
        titulo: 'Forza Horizon 5',
        genero: 'Carreras',
        plataforma: 'Xbox',
        puntuacion: 9.1,
      },
    ];

    if ((await this.repository.count()) === 0) {
      await this.repository.save(
        iniciales.map((videojuego) => this.repository.create(videojuego)),
      );
      return;
    }

    for (const videojuego of iniciales) {
      await this.repository.update(
        { titulo: videojuego.titulo, genero: 'Sin clasificar' },
        { genero: videojuego.genero },
      );
    }
  }

  // find() consulta la tabla videojuegos.
  // El resultado se ordena por puntuación descendente.
  findAll(): Promise<Videojuego[]> {
    return this.repository.find({
      order: { puntuacion: 'DESC' },
    });
  }
}
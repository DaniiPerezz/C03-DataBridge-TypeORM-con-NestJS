import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evento } from './evento.entity';

@Injectable()
export class EventoService implements OnModuleInit {
  constructor(
    @InjectRepository(Evento) private readonly repository: Repository<Evento>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          nombre: 'Tech Meetup',
          ciudad: 'Zaragoza',
          categoria: 'TecnologÃ­a',
          fecha: '2026-11-12',
        }),
        this.repository.create({
          nombre: 'Jazz en el Parque',
          ciudad: 'Huesca',
          categoria: 'MÃºsica',
          fecha: '2026-11-20',
        }),
      ]);
    }
  }

  findAll(): Promise<Evento[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }
  findFiltered(ciudad?: string, categoria?: string): Promise<Evento[]> {
    const where: Partial<Evento> = {};
    if (ciudad) where.ciudad = ciudad;
    if (categoria) where.categoria = categoria;
    return this.repository.find({ where, order: { id: 'ASC' } });
  }
  async findOne(id: number): Promise<Evento> {
    const registro = await this.repository.findOneBy({ id });
    if (!registro)
      throw new NotFoundException('No se ha encontrado el registro');
    return registro;
  }
  create(datos: Partial<Evento>): Promise<Evento> {
    return this.repository.save(this.repository.create(datos));
  }
  async update(id: number, datos: Partial<Evento>): Promise<Evento> {
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

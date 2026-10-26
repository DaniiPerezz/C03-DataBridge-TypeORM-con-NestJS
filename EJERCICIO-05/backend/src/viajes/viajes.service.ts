import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Viaje } from './viaje.entity';

@Injectable()
export class ViajeService implements OnModuleInit {
  constructor(
    @InjectRepository(Viaje) private readonly repository: Repository<Viaje>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          destino: 'Tokio',
          pais: 'JapÃ³n',
          estado: 'RESERVADO',
          fecha: '2026-08-10',
        }),
        this.repository.create({
          destino: 'Lisboa',
          pais: 'Portugal',
          estado: 'PENDIENTE',
          fecha: '2026-09-02',
        }),
      ]);
    }
  }

  findAll(): Promise<Viaje[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Viaje> {
    const registro = await this.repository.findOneBy({ id });
    if (!registro)
      throw new NotFoundException('No se ha encontrado el registro');
    return registro;
  }
  create(datos: Partial<Viaje>): Promise<Viaje> {
    return this.repository.save(this.repository.create(datos));
  }
  async update(id: number, datos: Partial<Viaje>): Promise<Viaje> {
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

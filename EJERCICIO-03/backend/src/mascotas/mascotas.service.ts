import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mascota } from './mascota.entity';

@Injectable()
export class MascotaService implements OnModuleInit {
  constructor(
    @InjectRepository(Mascota) private readonly repository: Repository<Mascota>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          nombre: 'Nala',
          especie: 'Golden Retriever',
          edad: 4,
          nivelEnergia: 'Alta',
        }),
        this.repository.create({
          nombre: 'Milo',
          especie: 'Gato',
          edad: 2,
          nivelEnergia: 'Media',
        }),
      ]);
    }
  }

  findAll(): Promise<Mascota[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Mascota> {
    const registro = await this.repository.findOneBy({ id });
    if (!registro)
      throw new NotFoundException('No se ha encontrado el registro');
    return registro;
  }
  create(datos: Partial<Mascota>): Promise<Mascota> {
    return this.repository.save(this.repository.create(datos));
  }
  async update(id: number, datos: Partial<Mascota>): Promise<Mascota> {
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

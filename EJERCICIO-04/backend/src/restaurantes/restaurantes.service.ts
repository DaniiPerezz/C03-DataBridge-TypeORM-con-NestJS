import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurante } from './restaurante.entity';

@Injectable()
export class RestauranteService implements OnModuleInit {
  constructor(
    @InjectRepository(Restaurante)
    private readonly repository: Repository<Restaurante>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          nombre: 'La Trattoria',
          tipo: 'Italiano',
          ciudad: 'Zaragoza',
          precioMedio: 22,
        }),
        this.repository.create({
          nombre: 'Sakura',
          tipo: 'JaponÃ©s',
          ciudad: 'Zaragoza',
          precioMedio: 28,
        }),
      ]);
    }
  }

  findAll(): Promise<Restaurante[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Restaurante> {
    const registro = await this.repository.findOneBy({ id });
    if (!registro)
      throw new NotFoundException('No se ha encontrado el registro');
    return registro;
  }
  create(datos: Partial<Restaurante>): Promise<Restaurante> {
    return this.repository.save(this.repository.create(datos));
  }
  async update(id: number, datos: Partial<Restaurante>): Promise<Restaurante> {
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

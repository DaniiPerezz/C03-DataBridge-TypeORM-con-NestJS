import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sneaker } from './sneaker.entity';

@Injectable()
export class SneakerService implements OnModuleInit {
  constructor(
    @InjectRepository(Sneaker) private readonly repository: Repository<Sneaker>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          modelo: 'Air Max 1',
          marca: 'Nike',
          stock: 4,
        }),
        this.repository.create({
          modelo: 'Forum Low',
          marca: 'Adidas',
          stock: 0,
        }),
      ]);
    }
  }

  findAll(): Promise<Sneaker[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Sneaker> {
    const registro = await this.repository.findOneBy({ id });
    if (!registro)
      throw new NotFoundException('No se ha encontrado el registro');
    return registro;
  }
  create(datos: Partial<Sneaker>): Promise<Sneaker> {
    return this.repository.save(this.repository.create(datos));
  }
  async update(id: number, datos: Partial<Sneaker>): Promise<Sneaker> {
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

import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Destino } from './destino.entity';

@Injectable()
export class DestinoService implements OnModuleInit {
  constructor(
    @InjectRepository(Destino) private readonly repository: Repository<Destino>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          nombre: 'Reikiavik',
          pais: 'Islandia',
          prioridad: 'Alta',
          visitado: false,
        }),
        this.repository.create({
          nombre: 'Kioto',
          pais: 'JapÃ³n',
          prioridad: 'Media',
          visitado: false,
        }),
      ]);
    }
  }

  findAll(): Promise<Destino[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Destino> {
    const registro = await this.repository.findOneBy({ id });
    if (!registro)
      throw new NotFoundException('No se ha encontrado el registro');
    return registro;
  }
  create(datos: Partial<Destino>): Promise<Destino> {
    return this.repository.save(this.repository.create(datos));
  }
  async update(id: number, datos: Partial<Destino>): Promise<Destino> {
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

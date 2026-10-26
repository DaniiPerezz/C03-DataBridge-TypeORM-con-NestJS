import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './libro.entity';

@Injectable()
export class LibroService implements OnModuleInit {
  constructor(
    @InjectRepository(Libro) private readonly repository: Repository<Libro>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.repository.count()) === 0) {
      await this.repository.save([
        this.repository.create({
          titulo: '1984',
          autor: 'George Orwell',
          leido: false,
        }),
        this.repository.create({
          titulo: 'El Hobbit',
          autor: 'J. R. R. Tolkien',
          leido: true,
        }),
      ]);
    }
  }

  findAll(): Promise<Libro[]> {
    return this.repository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Libro> {
    const registro = await this.repository.findOneBy({ id });
    if (!registro)
      throw new NotFoundException('No se ha encontrado el registro');
    return registro;
  }
  create(datos: Partial<Libro>): Promise<Libro> {
    return this.repository.save(this.repository.create(datos));
  }
  async marcarLeido(id: number): Promise<Libro> {
    const libro = await this.findOne(id);
    libro.leido = !libro.leido;
    return this.repository.save(libro);
  }
  async update(id: number, datos: Partial<Libro>): Promise<Libro> {
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

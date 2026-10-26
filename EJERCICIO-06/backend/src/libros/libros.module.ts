import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './libro.entity';
import { LibroController } from './libros.controller';
import { LibroService } from './libros.service';

@Module({
  imports: [TypeOrmModule.forFeature([Libro])],
  controllers: [LibroController],
  providers: [LibroService],
})
export class LibroModule {}

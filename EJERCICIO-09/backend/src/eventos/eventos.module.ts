import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './evento.entity';
import { EventoController } from './eventos.controller';
import { EventoService } from './eventos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Evento])],
  controllers: [EventoController],
  providers: [EventoService],
})
export class EventoModule {}

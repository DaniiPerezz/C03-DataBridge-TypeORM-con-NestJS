import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destino } from './destino.entity';
import { DestinoController } from './destinos.controller';
import { DestinoService } from './destinos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Destino])],
  controllers: [DestinoController],
  providers: [DestinoService],
})
export class DestinoModule {}

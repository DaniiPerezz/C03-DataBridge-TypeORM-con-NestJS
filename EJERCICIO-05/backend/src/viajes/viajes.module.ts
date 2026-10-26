import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Viaje } from './viaje.entity';
import { ViajeController } from './viajes.controller';
import { ViajeService } from './viajes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Viaje])],
  controllers: [ViajeController],
  providers: [ViajeService],
})
export class ViajeModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascota } from './mascota.entity';
import { MascotaController } from './mascotas.controller';
import { MascotaService } from './mascotas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mascota])],
  controllers: [MascotaController],
  providers: [MascotaService],
})
export class MascotaModule {}

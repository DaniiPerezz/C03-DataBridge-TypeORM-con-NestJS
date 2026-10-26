import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sneaker } from './sneaker.entity';
import { SneakerController } from './sneakers.controller';
import { SneakerService } from './sneakers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sneaker])],
  controllers: [SneakerController],
  providers: [SneakerService],
})
export class SneakerModule {}

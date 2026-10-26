import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Sneaker } from './sneaker.entity';
import { SneakerService } from './sneakers.service';

@Controller('sneakers')
export class SneakerController {
  constructor(private readonly service: SneakerService) {}
  @Get() findAll(@Query() filtros: Record<string, string>): Promise<Sneaker[]> {
    return this.service.findAll();
  }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number): Promise<Sneaker> {
    return this.service.findOne(id);
  }
  @Post() create(@Body() datos: Partial<Sneaker>): Promise<Sneaker> {
    return this.service.create(datos);
  }
  @Patch(':id') update(
    @Param('id', ParseIntPipe) id: number,
    @Body() datos: Partial<Sneaker>,
  ): Promise<Sneaker> {
    return this.service.update(id, datos);
  }
  @Delete(':id') remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eliminado: boolean }> {
    return this.service.remove(id);
  }
}

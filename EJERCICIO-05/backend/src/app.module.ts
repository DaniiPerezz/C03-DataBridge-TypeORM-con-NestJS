import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajeModule } from './viajes/viajes.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'databridge_e05',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ViajeModule,
  ],
})
export class AppModule {}

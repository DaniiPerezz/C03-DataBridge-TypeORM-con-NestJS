import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MascotaModule } from './mascotas/mascotas.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'databridge_e03',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MascotaModule,
  ],
})
export class AppModule {}

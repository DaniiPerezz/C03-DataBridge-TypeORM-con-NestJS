import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoModule } from './eventos/eventos.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'databridge_e09',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EventoModule,
  ],
})
export class AppModule {}

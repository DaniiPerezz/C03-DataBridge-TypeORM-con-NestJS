import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SneakerModule } from './sneakers/sneakers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'databridge_e07',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SneakerModule,
  ],
})
export class AppModule {}

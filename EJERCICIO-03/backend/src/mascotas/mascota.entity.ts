import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  especie: string;

  @Column()
  edad: number;

  @Column()
  nivelEnergia: string;
}
